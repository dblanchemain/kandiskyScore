#!/usr/bin/env python3
"""
audio_server.py — Serveur audio WebSocket pour kandiskyScore

Remplace les appels spawn(sox play ...) par un moteur de mixage unifié :
  - sounddevice (PortAudio) : ASIO/CoreAudio/JACK selon la plateforme
  - pyrubberband              : pitch shift & time stretch en mémoire
  - numpy                     : mix multicanal synchronisé
  - soundfile                 : lecture de fichiers audio

Protocole WebSocket JSON sur ws://127.0.0.1:9876 :

  Commandes → serveur :
    {"cmd":"play",    "id":"obj5", "file":"/abs/path.wav",
                      "pitch_semitones":0.0, "speed":1.0, "vol":1.0,
                      "trim_start":0.0, "trim_len":0.0,
                      "fade_in_type":"l",  "fade_in_len":0.0,
                      "fade_out_type":"l", "fade_out_len":0.0,
                      "notify_end":true}
    {"cmd":"preload", "file":"/abs/path.wav"}        ← pré-charge en cache (pas de lecture)
    {"cmd":"stop"}
    {"cmd":"stop_id",     "id":"obj5"}
    {"cmd":"list_devices"}
    {"cmd":"set_device",  "device":3, "channels":2, "samplerate":44100}
    {"cmd":"info",        "file":"/abs/path.wav"}
    {"cmd":"ping"}

  Réponses ← serveur :
    {"type":"playing",     "id":"obj5"}
    {"type":"voice_ended", "id":"obj5"}
    {"type":"stopped"}
    {"type":"stopped_id",  "id":"obj5"}
    {"type":"devices",     "list":[{"index":0,"name":"...","max_output_channels":2,...},...]}
    {"type":"device_set",  "device":3}
    {"type":"info",        "file":"...", "channels":2, "rate":44100, "samples":44100, "duration":1.0}
    {"type":"pong"}
    {"type":"error",       "message":"...", "id":"..."}  (id optionnel)
"""

import asyncio
import json
import logging
import math
import signal
import sys
import threading
import time
from typing import Optional

import numpy as np
import sounddevice as sd
import soundfile as sf

try:
    import pyrubberband as pyrb
    _PYRB_AVAILABLE = True
except ImportError:
    _PYRB_AVAILABLE = False

try:
    import websockets
    from websockets.server import WebSocketServerProtocol
except ImportError:
    print("ERREUR: le paquet 'websockets' est requis. Installez-le avec : pip install websockets", flush=True)
    sys.exit(1)

# ─────────────────────────────── Configuration ──────────────────────────────

HOST        = "127.0.0.1"
PORT        = 9876
BLOCK_SIZE  = 512   # frames par callback ≈ 11 ms @ 44100 Hz

logging.basicConfig(
    level=logging.INFO,
    format="[audio_server] %(levelname)s %(message)s",
    stream=sys.stderr,
)
log = logging.getLogger(__name__)


# ─────────────────────────────── Voice ──────────────────────────────────────

class Voice:
    """Une source audio en cours de lecture, déjà entièrement traitée en mémoire."""

    def __init__(self, voice_id: str, data: np.ndarray, notify_end: bool = True):
        """
        data        : ndarray float32, shape (frames, channels)
        notify_end  : si True, envoie voice_ended quand la voix se termine
        """
        self.id         = voice_id
        self.data       = data          # (frames, channels)
        self.pos        = 0
        self.done       = False
        self.notify_end = notify_end

    def read(self, n_frames: int) -> Optional[np.ndarray]:
        """Renvoie au plus n_frames frames (float32), ou None si terminé."""
        if self.done or self.pos >= len(self.data):
            self.done = True
            return None

        end   = min(self.pos + n_frames, len(self.data))
        chunk = self.data[self.pos:end]
        self.pos = end

        if self.pos >= len(self.data):
            self.done = True

        return chunk


# ─────────────────────────────── AudioMixer ─────────────────────────────────

class AudioMixer:
    """Moteur de mixage multi-voix via sounddevice.OutputStream."""

    def __init__(self):
        self.voices: dict[str, Voice] = {}
        self._lock         = threading.Lock()
        self.stream: Optional[sd.OutputStream] = None
        self.sample_rate   = 44100
        self.channels      = 2
        self.device_index: Optional[int] = None
        # Injectés depuis la boucle asyncio pour notifier les fins de voix
        self._loop: Optional[asyncio.AbstractEventLoop] = None
        self._notify_queue: Optional[asyncio.Queue]     = None

    # ── Injection de la boucle asyncio ───────────────────────────────────────

    def set_event_loop(self, loop: asyncio.AbstractEventLoop, queue: asyncio.Queue):
        self._loop         = loop
        self._notify_queue = queue

    # ── Callback audio (thread sounddevice) ──────────────────────────────────

    def _audio_callback(self, outdata: np.ndarray, frames: int, time_info, status):
        if status:
            log.warning("sounddevice status : %s", status)

        mix   = np.zeros((frames, self.channels), dtype=np.float32)
        ended = []

        with self._lock:
            for vid, voice in self.voices.items():
                chunk = voice.read(frames)
                if chunk is None:
                    ended.append(voice)
                    continue

                # Adapter le nombre de canaux
                if chunk.ndim == 1:
                    chunk = chunk[:, np.newaxis]
                n_ch = chunk.shape[1]
                if n_ch < self.channels:
                    chunk = np.repeat(chunk, self.channels // n_ch, axis=1)
                    if chunk.shape[1] > self.channels:
                        chunk = chunk[:, :self.channels]
                elif n_ch > self.channels:
                    chunk = chunk[:, :self.channels]

                n = chunk.shape[0]
                mix[:n] += chunk

                if voice.done:
                    ended.append(voice)

            for v in ended:
                self.voices.pop(v.id, None)

        np.clip(mix, -1.0, 1.0, out=mix)
        outdata[:] = mix

        # Notifier les fins de voix depuis le thread audio
        if ended and self._loop and self._notify_queue:
            for v in ended:
                if v.notify_end:
                    asyncio.run_coroutine_threadsafe(
                        self._notify_queue.put({"type": "voice_ended", "id": v.id}),
                        self._loop,
                    )

    # ── Gestion du stream ────────────────────────────────────────────────────

    def start_stream(self):
        if self.stream and self.stream.active:
            return
        kwargs = dict(
            samplerate = self.sample_rate,
            channels   = self.channels,
            dtype      = "float32",
            blocksize  = BLOCK_SIZE,
            callback   = self._audio_callback,
        )
        if self.device_index is not None:
            kwargs["device"] = self.device_index
        self.stream = sd.OutputStream(**kwargs)
        self.stream.start()
        log.info(
            "Stream démarré : %d Hz, %d canaux, device=%s",
            self.sample_rate, self.channels, self.device_index,
        )

    def _stop_stream(self):
        if self.stream:
            try:
                self.stream.stop()
                self.stream.close()
            except Exception:
                pass
            self.stream = None

    def set_device(self, device_index: Optional[int],
                   channels: Optional[int] = None,
                   samplerate: Optional[int] = None):
        """Change de périphérique de sortie (redémarre le stream)."""
        was_active = self.stream and self.stream.active
        self._stop_stream()
        if device_index is not None:
            self.device_index = device_index
        if channels is not None:
            self.channels = channels
        if samplerate is not None:
            self.sample_rate = samplerate
        if was_active:
            self.start_stream()

    # ── Contrôle des voix ────────────────────────────────────────────────────

    def add_voice(self, voice: Voice):
        with self._lock:
            self.voices[voice.id] = voice

    def stop_all(self):
        with self._lock:
            self.voices.clear()

    def stop_id(self, voice_id: str):
        with self._lock:
            self.voices.pop(voice_id, None)


# ─────────────────────────────── DSP helpers ────────────────────────────────

# Courbes de fondu supportées (identiques aux types SoX)
_FADE_CURVES = {
    "l": lambda t: t,                              # linéaire
    "q": lambda t: np.sin(t * np.pi / 2),         # quart de sinus (= SoX 'q')
    "h": lambda t: (1.0 - np.cos(t * np.pi)) / 2, # demi-cosinus  (= SoX 'h')
    "t": lambda t: t,                              # triangulaire  (≡ linéaire)
    "p": lambda t: t * t,                          # parabolique   (= SoX 'p')
}


def _fade_curve(ftype: str, t: np.ndarray) -> np.ndarray:
    fn = _FADE_CURVES.get(ftype, _FADE_CURVES["l"])
    return fn(t).astype(np.float32)


def apply_fades(data: np.ndarray, sr: int,
                fade_in_type: str,  fade_in_len: float,
                fade_out_type: str, fade_out_len: float) -> np.ndarray:
    """Applique fondu entrant et sortant sur data (frames, channels)."""
    n_frames = len(data)
    envelope = np.ones(n_frames, dtype=np.float32)

    if fade_in_len > 0.0:
        n_in = max(1, min(int(fade_in_len * sr), n_frames))
        t_in = np.linspace(0.0, 1.0, n_in, dtype=np.float32)
        envelope[:n_in] *= _fade_curve(fade_in_type, t_in)

    if fade_out_len > 0.0:
        n_out = max(1, min(int(fade_out_len * sr), n_frames))
        t_out = np.linspace(1.0, 0.0, n_out, dtype=np.float32)
        envelope[n_frames - n_out:] *= _fade_curve(fade_out_type, t_out)

    # Brodcasté sur (frames, channels)
    return (data * envelope[:, np.newaxis]).astype(np.float32)


def load_and_process(params: dict) -> tuple[np.ndarray, int]:
    """
    Charge un fichier WAV/FLAC/OGG et applique en mémoire :
      trim → speed + pitch (pyrubberband) → vol → fades

    Renvoie (data: float32 ndarray (frames, channels), sample_rate: int).
    """
    file_path        = params["file"]
    pitch_semitones  = float(params.get("pitch_semitones", 0.0))
    speed            = float(params.get("speed", 1.0))
    tempo_ratio      = float(params.get("tempo_ratio", 1.0))  # SoX "tempo" : temps sans hauteur
    vol              = float(params.get("vol",   1.0))
    trim_start       = float(params.get("trim_start", 0.0))
    trim_len         = float(params.get("trim_len",   0.0))  # 0 = jusqu'à la fin
    fade_in_type     = str(params.get("fade_in_type",  "l"))
    fade_in_len      = float(params.get("fade_in_len",  0.0))
    fade_out_type    = str(params.get("fade_out_type", "l"))
    fade_out_len     = float(params.get("fade_out_len", 0.0))

    # ── Lecture (avec cache disque) ──────────────────────────────────────────
    _t0 = time.time()
    data, sr = _cached_sf_read(file_path)
    _t1 = time.time()
    # data : (total_frames, channels)

    # ── Trim ─────────────────────────────────────────────────────────────────
    start_frame = max(0, int(trim_start * sr))
    end_frame   = (start_frame + int(trim_len * sr)) if trim_len > 0.0 else len(data)
    end_frame   = min(end_frame, len(data))
    data = data[start_frame:end_frame]

    if len(data) == 0:
        return np.zeros((1, 2), dtype=np.float32), sr

    # ── Speed + Pitch + Tempo via pyrubberband ───────────────────────────────
    # SoX "speed X"  = varispeed : tempo ET hauteur changent de facteur X.
    # SoX "tempo X"  = time stretch pur, hauteur inchangée.
    # Priorité : tempo_ratio > speed (on ne cumule pas les deux).
    _need_pyrb = (abs(speed - 1.0) > 1e-4 or abs(pitch_semitones) > 1e-4
                  or abs(tempo_ratio - 1.0) > 1e-4)
    if _PYRB_AVAILABLE and _need_pyrb:
        if abs(tempo_ratio - 1.0) > 1e-4:
            # Tempo seul : étirement sans changement de hauteur
            time_ratio  = 1.0 / max(tempo_ratio, 1e-4)
            pitch_shift = pitch_semitones
        else:
            # Varispeed : temps ET hauteur changent
            time_ratio  = 1.0 / max(speed, 1e-4)
            pitch_shift = pitch_semitones + (
                -12.0 * math.log2(speed) if speed > 0.0 else 0.0
            )
        n_channels = data.shape[1]
        processed_channels = []
        for ch in range(n_channels):
            ch_data = data[:, ch]
            ch_data = pyrb.time_stretch(ch_data, sr, time_ratio)
            if abs(pitch_shift) > 1e-4:
                ch_data = pyrb.pitch_shift(ch_data, sr, pitch_shift)
            processed_channels.append(ch_data)
        # Aligner les longueurs (pyrubberband peut varier légèrement entre canaux)
        min_len = min(len(c) for c in processed_channels)
        data = np.column_stack([c[:min_len] for c in processed_channels]).astype(np.float32)
    elif not _PYRB_AVAILABLE and _need_pyrb:
        log.warning("pyrubberband absent — speed/pitch/tempo ignorés pour %s", file_path)

    _t2 = time.time()
    log.info("Timings load_and_process — cache/io: %.0f ms, pyrb: %.0f ms, total: %.0f ms | "
             "speed=%.3f pitch=%.1f tempo=%.3f file=%s",
             (_t1-_t0)*1000, (_t2-_t1)*1000, (_t2-_t0)*1000,
             speed, pitch_semitones, tempo_ratio, file_path)

    # ── Volume ───────────────────────────────────────────────────────────────
    if abs(vol - 1.0) > 1e-6:
        data = (data * vol).astype(np.float32)

    # ── Fades ─────────────────────────────────────────────────────────────────
    if fade_in_len > 0.0 or fade_out_len > 0.0:
        data = apply_fades(data, sr, fade_in_type, fade_in_len, fade_out_type, fade_out_len)

    return data, sr


# ─────────────────────────────── Cache audio ────────────────────────────────
# Stocke les données brutes (avant DSP) pour éviter la relecture disque.
# Clé : chemin absolu du fichier. Valeur : (ndarray float32, sample_rate).
_raw_cache: dict[str, tuple[np.ndarray, int]] = {}
_raw_cache_lock = threading.Lock()


def _cached_sf_read(file_path: str) -> tuple[np.ndarray, int]:
    """sf.read() avec cache en mémoire pour éviter les accès disque répétés."""
    with _raw_cache_lock:
        if file_path in _raw_cache:
            data, sr = _raw_cache[file_path]
            return data.copy(), sr   # copie pour ne pas altérer le cache
    data, sr = sf.read(file_path, dtype="float32", always_2d=True)
    with _raw_cache_lock:
        _raw_cache[file_path] = (data, sr)
    log.debug("Cache : ajout %s (%.1f s, %d Hz)", file_path, len(data)/sr, sr)
    return data.copy(), sr


# ─────────────────────────────── Serveur WebSocket ──────────────────────────

mixer              = AudioMixer()
connected_clients: set = set()


async def handle_client(websocket: "WebSocketServerProtocol"):
    connected_clients.add(websocket)
    addr = getattr(websocket, "remote_address", "?")
    log.info("Client connecté : %s", addr)
    try:
        async for raw in websocket:
            try:
                msg = json.loads(raw)
            except json.JSONDecodeError:
                await _send(websocket, {"type": "error", "message": "JSON invalide"})
                continue
            await dispatch(websocket, msg)
    except websockets.exceptions.ConnectionClosed:
        pass
    except Exception as exc:
        log.error("Erreur inattendue pour %s : %s", addr, exc)
    finally:
        connected_clients.discard(websocket)
        log.info("Client déconnecté : %s", addr)


async def dispatch(ws: "WebSocketServerProtocol", msg: dict):
    cmd    = msg.get("cmd", "")
    req_id = msg.get("_reqId")

    # Wrapper : injecte _reqId dans chaque réponse si la requête en avait un
    async def reply(data: dict):
        if req_id:
            data = {**data, "_reqId": req_id}
        await _send(ws, data)

    if cmd == "play":
        await cmd_play(ws, msg, reply)

    elif cmd == "preload":
        await cmd_preload(ws, msg, reply)

    elif cmd == "stop":
        mixer.stop_all()
        await reply({"type": "stopped"})

    elif cmd == "stop_id":
        vid = msg.get("id", "")
        mixer.stop_id(vid)
        await reply({"type": "stopped_id", "id": vid})

    elif cmd == "list_devices":
        await cmd_list_devices(ws, reply)

    elif cmd == "set_device":
        device_idx = msg.get("device")
        channels   = msg.get("channels")
        samplerate = msg.get("samplerate")
        mixer.set_device(device_idx, channels, samplerate)
        await reply({"type": "device_set", "device": device_idx})

    elif cmd == "info":
        await cmd_info(ws, msg, reply)

    elif cmd == "ping":
        await reply({"type": "pong"})

    elif cmd == "status":
        with mixer._lock:
            active_ids = list(mixer.voices.keys())
        await reply({
            "type": "status",
            "active_voices": active_ids,
            "stream_active": bool(mixer.stream and mixer.stream.active),
            "sample_rate": mixer.sample_rate,
            "channels": mixer.channels,
            "device": mixer.device_index,
            "pyrubberband": _PYRB_AVAILABLE,
        })

    else:
        await reply({"type": "error", "message": f"Commande inconnue : {cmd!r}"})


async def cmd_play(ws: "WebSocketServerProtocol", params: dict, reply):
    voice_id          = params.get("id", f"voice_{id(params)}")
    notify_end        = bool(params.get("notify_end", True))
    compensate_delay  = bool(params.get("compensate_delay", False))
    t_sent_ms         = params.get("t_sent")   # horodatage JS (ms)

    t_before = time.time()

    try:
        # Traitement audio dans un thread (opérations I/O + DSP bloquantes)
        loop = asyncio.get_event_loop()
        data, sr = await loop.run_in_executor(None, load_and_process, params)

        # Compensation du retard : sauter les frames correspondant au temps de traitement Python.
        # On mesure uniquement le délai côté Python (load + DSP) — t_sent_ms sert de diagnostic.
        if compensate_delay:
            t_now_ms    = time.time() * 1000.0
            delay_ms    = t_now_ms - t_before * 1000.0   # délai de traitement Python uniquement
            if t_sent_ms:
                transit_ms = (t_before * 1000.0) - t_sent_ms
                log.debug("Transit IPC→WS : %.0f ms, traitement Python : %.0f ms",
                          transit_ms, delay_ms)
            skip_frames = int(max(0.0, delay_ms / 1000.0) * sr)
            # Ne jamais sauter plus de 500 ms ni plus de 50 % de l'audio
            max_skip    = min(int(0.5 * sr), len(data) // 2)
            skip_frames = min(skip_frames, max_skip)
            if 0 < skip_frames < len(data):
                data = data[skip_frames:]
                log.info("Compensation délai : %.0f ms → skip %d frames (%.0f ms audio restant)",
                         delay_ms, skip_frames, len(data) / sr * 1000)

        # Démarrer le stream si nécessaire (ou si le sr a changé)
        if mixer.stream is None or not mixer.stream.active:
            mixer.sample_rate = sr
            mixer.start_stream()

        # Adapter le nombre de canaux de la voix à celui du stream
        if data.shape[1] < mixer.channels:
            data = np.repeat(data, mixer.channels // data.shape[1], axis=1)
            if data.shape[1] > mixer.channels:
                data = data[:, :mixer.channels]
        elif data.shape[1] > mixer.channels:
            data = data[:, :mixer.channels]

        voice = Voice(voice_id, data.astype(np.float32), notify_end=notify_end)
        mixer.add_voice(voice)
        await reply({"type": "playing", "id": voice_id})
        log.info("Lecture : id=%s  file=%s", voice_id, params.get("file", "?"))

    except FileNotFoundError:
        errmsg = f"Fichier introuvable : {params.get('file', '?')}"
        log.error(errmsg)
        await reply({"type": "error", "id": voice_id, "message": errmsg})
    except Exception as exc:
        log.error("Erreur play id=%s : %s", voice_id, exc)
        await reply({"type": "error", "id": voice_id, "message": str(exc)})


async def cmd_preload(ws: "WebSocketServerProtocol", msg: dict, reply):
    """Pré-charge un fichier audio en mémoire sans le lire."""
    file_path = msg.get("file", "")
    try:
        already = file_path in _raw_cache
        if not already:
            loop = asyncio.get_event_loop()
            await loop.run_in_executor(None, _cached_sf_read, file_path)
        await reply({"type": "preloaded", "file": file_path, "already_cached": already})
        log.info("Pré-chargé : %s%s", file_path, " (déjà en cache)" if already else "")
    except Exception as exc:
        await reply({"type": "error", "message": str(exc)})


async def cmd_list_devices(ws: "WebSocketServerProtocol", reply):
    try:
        devices    = sd.query_devices()
        default_in, default_out = sd.default.device
        device_list = []
        for i, d in enumerate(devices):
            if d["max_output_channels"] < 1:
                continue
            device_list.append({
                "index":               i,
                "name":                d["name"],
                "max_output_channels": d["max_output_channels"],
                "default_samplerate":  d["default_samplerate"],
                "is_default":          i == default_out,
            })
        await reply({"type": "devices", "list": device_list})
    except Exception as exc:
        await reply({"type": "error", "message": str(exc)})


async def cmd_info(ws: "WebSocketServerProtocol", msg: dict, reply):
    file_path = msg.get("file", "")
    try:
        info = sf.info(file_path)
        await reply({
            "type":     "info",
            "file":     file_path,
            "channels": info.channels,
            "rate":     info.samplerate,
            "samples":  info.frames,
            "duration": round(info.duration, 6),
            "format":   info.format,
        })
    except Exception as exc:
        await reply({"type": "error", "message": str(exc)})


async def _send(ws: "WebSocketServerProtocol", data: dict):
    try:
        await ws.send(json.dumps(data))
    except websockets.exceptions.ConnectionClosed:
        pass


# ─────────────────────────────── Broadcaster de notifications ───────────────

async def notification_broadcaster(queue: asyncio.Queue):
    """Diffuse les notifications (fin de voix) à tous les clients connectés."""
    while True:
        msg = await queue.get()
        if connected_clients:
            payload = json.dumps(msg)
            await asyncio.gather(
                *[client.send(payload) for client in connected_clients],
                return_exceptions=True,
            )


# ─────────────────────────────── Détection JACK ─────────────────────────────

def find_jack_device() -> Optional[int]:
    """
    Retourne l'index du device de sortie JACK si disponible, sinon None.
    Cherche d'abord via l'API JACK de PortAudio, puis par nom de device.
    """
    # Méthode 1 : via l'API JACK (PortAudio host API)
    for api in sd.query_hostapis():
        if "JACK" in api.get("name", ""):
            dev_idx = api.get("default_output_device", -1)
            if dev_idx >= 0:
                return dev_idx
    # Méthode 2 : par nom de device (fallback)
    for i, d in enumerate(sd.query_devices()):
        if d["name"].lower() == "jack" and d["max_output_channels"] > 0:
            return i
    return None


# ─────────────────────────────── Point d'entrée ─────────────────────────────

async def async_main():
    loop  = asyncio.get_event_loop()
    queue: asyncio.Queue = asyncio.Queue()

    mixer.set_event_loop(loop, queue)

    # Auto-sélection JACK sur Linux si disponible
    if sys.platform.startswith("linux"):
        jack_dev = find_jack_device()
        if jack_dev is not None:
            mixer.device_index = jack_dev
            d = sd.query_devices(jack_dev)
            log.info("JACK détecté → device [%d] %s (%d canaux)",
                     jack_dev, d["name"], d["max_output_channels"])
        else:
            log.info("JACK non détecté, utilisation du device par défaut")

    # Stream audio démarré en avance pour réduire la latence du premier son
    try:
        mixer.start_stream()
    except Exception as exc:
        log.warning("Impossible de démarrer le stream audio au démarrage : %s", exc)

    asyncio.create_task(notification_broadcaster(queue))

    log.info("Démarrage WebSocket sur ws://%s:%d", HOST, PORT)

    async with websockets.serve(handle_client, HOST, PORT):
        # Signal de prêt lu par main.js pour savoir que le serveur est opérationnel
        print("AUDIO_SERVER_READY", flush=True)
        log.info("Serveur prêt — en attente de connexions")

        stop_event = asyncio.Event()

        def _on_signal():
            stop_event.set()

        for sig in (signal.SIGINT, signal.SIGTERM):
            try:
                loop.add_signal_handler(sig, _on_signal)
            except (NotImplementedError, OSError):
                # Windows : les signal handlers asyncio ne sont pas tous supportés
                pass

        await stop_event.wait()

    log.info("Arrêt propre du serveur")


def main():
    try:
        asyncio.run(async_main())
    except KeyboardInterrupt:
        log.info("Interruption clavier")


if __name__ == "__main__":
    main()
