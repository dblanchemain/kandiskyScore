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
import os
import signal
import sys
import threading
import time
from typing import Optional

# ── Nom du client JACK (Linux) ───────────────────────────────────────────────
# PortAudio lit /proc/self/cmdline (argv[0]) et /proc/self/comm pour nommer
# le bloc dans le patch-bay JACK.  On impose "kandiskyscore" via prctl avant
# l'import de sounddevice afin que PortAudio ne lise pas encore argv[0].
if sys.platform.startswith("linux"):
    try:
        import ctypes, ctypes.util as _cu
        _libc = ctypes.CDLL(_cu.find_library("c"), use_errno=True)
        _JACK_NAME = b"kandiskyscore"
        _libc.prctl(15, _JACK_NAME, 0, 0, 0)   # PR_SET_NAME = 15 (max 15 car.)
    except Exception:
        pass

import numpy as np
import sounddevice as sd
import soundfile as sf

try:
    import pyrubberband as pyrb
    import pyrubberband.pyrb as _pyrb_internal
    import subprocess as _subprocess_orig
    import types as _types

    # ── Binaire rubberband depuis les resources (Windows/macOS packagé) ──────
    _rb_path = os.environ.get("RUBBERBAND_PATH", "").strip()
    if _rb_path:
        _pyrb_internal.__RUBBERBAND_UTIL = _rb_path
        print(f"[audio_server] rubberband binaire : {_rb_path}", flush=True)

    # ── Silencer stdout/stderr du binaire rubberband ─────────────────────────
    # pyrubberband appelle subprocess.check_call (ou run) sans redirection ;
    # on remplace son référence au module subprocess par un wrapper muet.
    class _QuietSubprocess(_types.ModuleType):
        """Wrapper subprocess qui redirige stdout+stderr vers DEVNULL."""
        DEVNULL = _subprocess_orig.DEVNULL
        PIPE    = _subprocess_orig.PIPE
        STDOUT  = _subprocess_orig.STDOUT
        def __getattr__(self, name):
            fn = getattr(_subprocess_orig, name)
            if name in ("check_call", "run", "check_output", "call"):
                def _quiet(args, **kw):
                    kw.setdefault("stdout", _subprocess_orig.DEVNULL)
                    kw.setdefault("stderr", _subprocess_orig.DEVNULL)
                    return fn(args, **kw)
                return _quiet
            return fn

    _pyrb_internal.subprocess = _QuietSubprocess("subprocess")

    _PYRB_AVAILABLE = True
except ImportError:
    _PYRB_AVAILABLE = False

try:
    import websockets
    from websockets.server import WebSocketServerProtocol
except ImportError:
    print("ERREUR: le paquet 'websockets' est requis. Installez-le avec : pip install websockets", flush=True)
    sys.exit(1)


# ─── Protocole NSM / RaySession ──────────────────────────────────────────────
import re      as _re
import socket  as _socket
import struct  as _struct


def _osc_pad(b: bytes) -> bytes:
    """Aligne sur 4 octets (padding nul)."""
    r = len(b) % 4
    return b + (b'\x00' * ((4 - r) % 4))


def _osc_str(s: str) -> bytes:
    return _osc_pad(s.encode() + b'\x00')


def _osc_encode(address: str, *args) -> bytes:
    tags, payload = b',', b''
    for a in args:
        if isinstance(a, str):
            tags   += b's';  payload += _osc_str(a)
        elif isinstance(a, int):
            tags   += b'i';  payload += _struct.pack('>i', a)
        elif isinstance(a, float):
            tags   += b'f';  payload += _struct.pack('>f', a)
    return _osc_str(address) + _osc_str(tags.decode()) + payload


def _osc_decode(data: bytes) -> tuple:
    def read_str(pos: int):
        end = data.index(b'\x00', pos)
        s   = data[pos:end].decode(errors='replace')
        pos = end + 1
        pos += (4 - pos % 4) % 4
        return s, pos

    address, pos  = read_str(0)
    tags_raw, pos = read_str(pos)
    args = []
    for t in tags_raw.lstrip(','):
        if t == 's':
            s, pos = read_str(pos); args.append(s)
        elif t == 'i':
            args.append(_struct.unpack('>i', data[pos:pos+4])[0]); pos += 4
        elif t == 'f':
            args.append(_struct.unpack('>f', data[pos:pos+4])[0]); pos += 4
    return address, args


class NsmClient:
    """
    Client NSM (Non Session Manager) minimal — intégration RaySession.

    Au démarrage (si NSM_URL est défini) :
      • S'annonce au serveur NSM
      • Sur /nsm/client/open  : retient le chemin de session, marque une
        restauration de connexions JACK en attente
      • Sur /nsm/client/save  : écrit les connexions JACK courantes en JSON
      • Sur session_is_loaded : restaure les connexions si le stream est actif
    start_stream() consulte _pending_restore pour restaurer dès l'ouverture.
    """

    _SKIP = {"system", "_ks_snapshot", "_ks_restore"}   # préfixes ignorés

    def __init__(self):
        self.url              = os.environ.get("NSM_URL", "")
        self._sock: Optional[_socket.socket] = None
        self._server          = None          # (host, port)
        self._stop            = threading.Event()
        self.session_path: Optional[str] = None
        self.client_id:    Optional[str] = None
        self._pending_restore             = False

    # ── Démarrage ────────────────────────────────────────────────────────────

    def start(self) -> bool:
        if not self.url:
            return False
        m = _re.match(r'osc\.udp://([^:]+):(\d+)/?', self.url)
        if not m:
            log.warning("NSM: URL invalide : %s", self.url)
            return False
        self._server = (m.group(1), int(m.group(2)))
        self._sock   = _socket.socket(_socket.AF_INET, _socket.SOCK_DGRAM)
        self._sock.bind(('', 0))
        self._sock.settimeout(0.5)
        self._announce()
        threading.Thread(target=self._loop, daemon=True,
                         name="nsm-client").start()
        return True

    def _announce(self):
        exe = os.path.basename(sys.argv[0])
        self._send("/nsm/server/announce",
                   "kandiskyScore", ":dirty:", exe, 1, 2, os.getpid())
        log.info("NSM: annonce envoyée → %s:%d", *self._server)

    # ── OSC send/recv ────────────────────────────────────────────────────────

    def _send(self, address: str, *args):
        self._sock.sendto(_osc_encode(address, *args), self._server)

    def _loop(self):
        while not self._stop.is_set():
            try:
                data, _ = self._sock.recvfrom(4096)
                addr, args = _osc_decode(data)
                self._dispatch(addr, args)
            except _socket.timeout:
                pass
            except Exception as exc:
                if not self._stop.is_set():
                    log.warning("NSM recv: %s", exc)

    # ── Gestion des messages NSM ──────────────────────────────────────────────

    def _dispatch(self, address: str, args: list):
        log.debug("NSM ← %s %s", address, args)

        if address == "/reply" and args and args[0] == "/nsm/server/announce":
            self.client_id = args[3] if len(args) > 3 else ""
            log.info("NSM: connecté — client_id=%s", self.client_id)

        elif address == "/nsm/client/open":
            self.session_path  = args[0] if args else ""
            self.client_id     = args[2] if len(args) > 2 else self.client_id
            log.info("NSM: open → %s", self.session_path)
            os.makedirs(self.session_path, exist_ok=True)
            self._pending_restore = True
            self._send("/reply", "/nsm/client/open", "OK")

        elif address == "/nsm/client/save":
            log.info("NSM: save")
            self._save()
            self._send("/reply", "/nsm/client/save", "OK")

        elif address == "/nsm/client/session_is_loaded":
            log.info("NSM: session chargée")
            if mixer.stream and mixer.stream.active:
                self.restore_connections()

        elif address == "/nsm/client/quit":
            log.info("NSM: quit")
            os.kill(os.getpid(), signal.SIGTERM)

        elif address == "/error":
            log.warning("NSM erreur: %s", args)

    # ── JACK : sauvegarde ────────────────────────────────────────────────────

    def _state_file(self) -> Optional[str]:
        if not self.session_path:
            return None
        return os.path.join(self.session_path, "jack_connections.json")

    def _save(self):
        path = self._state_file()
        if not path:
            return
        conns = self._snapshot_jack()
        try:
            with open(path, 'w') as f:
                json.dump(conns, f, indent=2)
            total = sum(len(v) for v in conns.values())
            log.info("NSM: %d connexion(s) JACK sauvegardée(s)", total)
        except Exception as exc:
            log.warning("NSM save: %s", exc)

    def _snapshot_jack(self) -> dict:
        """Retourne {port_src: [port_dst, …]} pour tous les clients non-système."""
        result = {}
        if not sys.platform.startswith("linux"):
            return result
        try:
            import ctypes, ctypes.util as _cu
            lj = ctypes.CDLL(_cu.find_library("jack") or "libjack.so.0")
            lj.jack_client_open.restype  = ctypes.c_void_p
            lj.jack_port_by_name.restype = ctypes.c_void_p
            lj.jack_get_ports.restype    = ctypes.POINTER(ctypes.c_char_p)
            lj.jack_port_get_all_connections.restype = ctypes.POINTER(ctypes.c_char_p)
            lj.jack_free.restype         = None

            status = ctypes.c_int(0)
            client = lj.jack_client_open(b"_ks_snapshot", 1,
                                          ctypes.byref(status))
            if not client:
                return result
            lj.jack_activate(client)

            ports = lj.jack_get_ports(client, None, None, 0x2)  # JackPortIsOutput
            if ports:
                i = 0
                while ports[i]:
                    name   = ports[i].decode()
                    prefix = name.split(":")[0]
                    if prefix not in self._SKIP:
                        port = lj.jack_port_by_name(client, ports[i])
                        if port:
                            conns = lj.jack_port_get_all_connections(client, port)
                            if conns:
                                lst, j = [], 0
                                while conns[j]:
                                    dst = conns[j].decode()
                                    # Ne pas sauvegarder les connexions vers
                                    # system:* — elles sont gérées par le
                                    # patch-bay et ne doivent pas être
                                    # restaurées automatiquement.
                                    if not dst.startswith("system:"):
                                        lst.append(dst)
                                    j += 1
                                lj.jack_free(conns)
                                if lst:
                                    result[name] = lst
                    i += 1
                lj.jack_free(ports)
            lj.jack_client_close(client)
        except Exception as exc:
            log.warning("NSM snapshot JACK: %s", exc)
        return result

    # ── JACK : restauration ──────────────────────────────────────────────────

    def restore_connections(self):
        """Lance la restauration des connexions JACK en arrière-plan.
        _apply_jack tourne TOUJOURS en mode NSM pour couper system:playback_*,
        même si aucun fichier de sauvegarde n'existe encore."""
        self._pending_restore = False
        conns: dict = {}
        path = self._state_file()
        if path and os.path.exists(path):
            try:
                with open(path) as f:
                    conns = json.load(f)
            except Exception as exc:
                log.warning("NSM restore lecture: %s", exc)
        # Lancer _apply_jack même si conns est vide : il doit couper system
        threading.Thread(target=self._apply_jack, args=(conns,),
                         daemon=True, name="nsm-restore").start()

    def _apply_jack(self, connections: dict):
        """
        Si des connexions sont sauvegardées :
          1. Attend que PortAudio enregistre ses ports.
          2. Déconnecte en force tous les ports de sortie de system:playback_*
             (brute-force : essaie chaque port de sortie × chaque playback_N,
             sans jack_port_get_all_connections qui échouait silencieusement).
          3. Applique les connexions sauvegardées via ctypes (fonctionnait avant).
          En cas d'échec total, reconnecte system en fallback pour garantir le son.
        Si aucune connexion sauvegardée : ne fait rien (son via system conservé).
        """
        if not connections:
            return
        time.sleep(0.5)
        if not sys.platform.startswith("linux"):
            return
        try:
            import ctypes, ctypes.util as _cu
            lj = ctypes.CDLL(_cu.find_library("jack") or "libjack.so.0")
            lj.jack_client_open.restype  = ctypes.c_void_p
            lj.jack_port_by_name.restype = ctypes.c_void_p
            lj.jack_get_ports.restype    = ctypes.POINTER(ctypes.c_char_p)
            lj.jack_free.restype         = None
            lj.jack_connect.restype      = ctypes.c_int
            lj.jack_disconnect.restype   = ctypes.c_int

            status = ctypes.c_int(0)
            client = lj.jack_client_open(b"_ks_restore", 1, ctypes.byref(status))
            if not client:
                return
            ret = lj.jack_activate(client)
            if ret != 0:
                lj.jack_client_close(client)
                return

            # 1. Brute-force : tous les ports de sortie × tous les system:playback_*
            JackPortIsOutput = 0x2
            out_ports = lj.jack_get_ports(client, None, None, JackPortIsOutput)
            disconnected = 0
            if out_ports:
                i = 1
                while True:
                    dst = f"system:playback_{i}".encode()
                    if not lj.jack_port_by_name(client, dst):
                        break
                    j = 0
                    while out_ports[j]:
                        r = lj.jack_disconnect(client, out_ports[j], dst)
                        if r == 0:
                            log.info("NSM: déconnecté %s → %s",
                                     out_ports[j].decode(), dst.decode())
                            disconnected += 1
                        j += 1
                    i += 1
                lj.jack_free(out_ports)

            # 2. Appliquer les connexions sauvegardées (system:* ignoré)
            connected = 0
            for src, dsts in connections.items():
                for dst in dsts:
                    if dst.startswith("system:"):
                        continue
                    r = lj.jack_connect(client, src.encode(), dst.encode())
                    if r == 0:
                        log.info("NSM: restauré %s → %s", src, dst)
                        connected += 1
                    else:
                        log.warning("NSM: échec connexion %s → %s (code %d)",
                                    src, dst, r)

            # 3. Fallback : si aucune connexion n'a pu être établie, reconnecter system
            if connected == 0 and disconnected > 0:
                log.warning("NSM: aucune connexion restaurée — reconnexion system en fallback")
                out_ports = lj.jack_get_ports(client, None, None, JackPortIsOutput)
                if out_ports:
                    i = 1
                    j = 0
                    while out_ports[j]:
                        dst = f"system:playback_{i}".encode()
                        if not lj.jack_port_by_name(client, dst):
                            break
                        lj.jack_connect(client, out_ports[j], dst)
                        i += 1
                        j += 1
                    lj.jack_free(out_ports)

            lj.jack_client_close(client)
        except Exception as exc:
            log.warning("NSM apply JACK: %s", exc)

    def stop(self):
        self._stop.set()
        if self._sock:
            self._sock.close()


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

# Instance NSM globale (active uniquement si NSM_URL est défini)
nsm = NsmClient()

# ─── Persistance JACK autonome ────────────────────────────────────────────────
_JACK_CONN_FILE = os.path.join(
    os.environ.get("XDG_CONFIG_HOME", os.path.expanduser("~/.config")),
    "kandiskyscore", "jack_connections.json"
)

def _jack_ctypes():
    """Retourne (libjack, client) prêt à l'emploi, ou (None, None)."""
    try:
        import ctypes, ctypes.util as _cu
        lj = ctypes.CDLL(_cu.find_library("jack") or "libjack.so.0")
        lj.jack_client_open.restype  = ctypes.c_void_p
        lj.jack_port_by_name.restype = ctypes.c_void_p
        lj.jack_get_ports.restype    = ctypes.POINTER(ctypes.c_char_p)
        lj.jack_port_get_all_connections.restype = ctypes.POINTER(ctypes.c_char_p)
        lj.jack_free.restype         = None
        lj.jack_connect.restype      = ctypes.c_int
        lj.jack_disconnect.restype   = ctypes.c_int
        status = ctypes.c_int(0)
        client = lj.jack_client_open(b"_ks_jack", 1, ctypes.byref(status))
        if not client:
            return None, None
        lj.jack_activate(client)
        return lj, client
    except Exception as exc:
        log.warning("JACK ctypes: %s", exc)
        return None, None


def jack_save_connections():
    """Sauvegarde les connexions JACK courantes (hors system:*) dans le fichier config."""
    if not sys.platform.startswith("linux"):
        return
    lj, client = _jack_ctypes()
    if not client:
        return
    result = {}
    try:
        ports = lj.jack_get_ports(client, None, None, 0x2)  # JackPortIsOutput
        if ports:
            i = 0
            while ports[i]:
                name = ports[i].decode()
                if not name.split(":")[0].startswith("_ks"):
                    port = lj.jack_port_by_name(client, ports[i])
                    if port:
                        conns = lj.jack_port_get_all_connections(client, port)
                        if conns:
                            lst, j = [], 0
                            while conns[j]:
                                dst = conns[j].decode()
                                if not dst.startswith("system:"):
                                    lst.append(dst)
                                j += 1
                            lj.jack_free(conns)
                            if lst:
                                result[name] = lst
                i += 1
            lj.jack_free(ports)
    finally:
        lj.jack_client_close(client)
    os.makedirs(os.path.dirname(_JACK_CONN_FILE), exist_ok=True)
    with open(_JACK_CONN_FILE, "w") as f:
        json.dump(result, f, indent=2)
    log.info("JACK: %d connexion(s) sauvegardée(s) → %s",
             sum(len(v) for v in result.values()), _JACK_CONN_FILE)


def jack_restore_connections():
    """Restaure les connexions JACK depuis le fichier config.
    Ordre sûr : connecter d'abord, couper system seulement si ça a marché.
    Si la restauration échoue entièrement : system conservé → pas de silence."""
    if not os.path.exists(_JACK_CONN_FILE):
        return
    try:
        with open(_JACK_CONN_FILE) as f:
            connections = json.load(f)
    except Exception as exc:
        log.warning("JACK restore lecture: %s", exc)
        return
    if not connections:
        return

    time.sleep(0.5)   # laisser PortAudio enregistrer ses ports JACK
    lj, client = _jack_ctypes()
    if not client:
        return
    try:
        # 1. Connecter d'abord vers les destinations sauvegardées
        connected = 0
        for src, dsts in connections.items():
            for dst in dsts:
                if dst.startswith("system:"):
                    continue
                if lj.jack_connect(client, src.encode(), dst.encode()) == 0:
                    log.info("JACK: restauré %s → %s", src, dst)
                    connected += 1
                else:
                    log.warning("JACK: échec restauration %s → %s", src, dst)

        # 2. Couper system:playback_* seulement si au moins une connexion a réussi
        if connected > 0:
            out_ports = lj.jack_get_ports(client, None, None, 0x2)
            if out_ports:
                i = 1
                while True:
                    dst = f"system:playback_{i}".encode()
                    if not lj.jack_port_by_name(client, dst):
                        break
                    j = 0
                    while out_ports[j]:
                        if lj.jack_disconnect(client, out_ports[j], dst) == 0:
                            log.info("JACK: déconnecté %s → %s",
                                     out_ports[j].decode(), dst.decode())
                        j += 1
                    i += 1
                lj.jack_free(out_ports)
        else:
            log.warning("JACK: aucune connexion restaurée — system conservé")
    finally:
        lj.jack_client_close(client)


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

                # Adapter le nombre de canaux du chunk au stream
                if chunk.ndim == 1:
                    chunk = chunk[:, np.newaxis]
                n_ch = chunk.shape[1]
                if n_ch < self.channels:
                    # Compléter avec des zéros : audio sur les premiers canaux,
                    # le reste silencieux (le routage JACK gère la spatialisation)
                    padded = np.zeros((chunk.shape[0], self.channels), dtype=np.float32)
                    padded[:, :n_ch] = chunk
                    chunk = padded
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
        # JACK : restaurer les connexions sauvegardées si elles existent
        if sys.platform.startswith("linux") and self.device_index is not None:
            threading.Thread(target=jack_restore_connections,
                             daemon=True, name="jack-restore").start()

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

    # ── Pitch shift AVANT speed (pyrubberband sur le plus petit array possible) ─
    # SoX applique les effets gauche→droite : pitch d'abord, puis speed.
    # On fait pareil : pyrubberband opère sur l'audio original (court),
    # AVANT que numpy interp ne l'étire (potentiellement 7×).
    if abs(pitch_semitones) > 1e-4:
        if _PYRB_AVAILABLE:
            processed = []
            for ch in range(data.shape[1]):
                processed.append(pyrb.pitch_shift(data[:, ch], sr, pitch_semitones))
            min_len = min(len(c) for c in processed)
            data = np.column_stack([c[:min_len] for c in processed]).astype(np.float32)
        else:
            log.warning("pyrubberband absent — pitch ignoré pour %s", file_path)

    # ── Speed via rééchantillonnage numpy (SoX "speed" = varispeed) ─────────
    # Opère après pitch pour ne pas agrandir inutilement le tableau avant pyrb.
    if abs(speed - 1.0) > 1e-4:
        new_len = max(1, int(round(len(data) / speed)))
        x_old   = np.arange(len(data), dtype=np.float64)
        x_new   = np.linspace(0, len(data) - 1, new_len, dtype=np.float64)
        data    = np.column_stack([
            np.interp(x_new, x_old, data[:, ch]) for ch in range(data.shape[1])
        ]).astype(np.float32)

    # ── Tempo (time stretch sans changement de hauteur) via pyrubberband ─────
    # SoX "tempo X" — seulement si explicitement demandé.
    if abs(tempo_ratio - 1.0) > 1e-4:
        if _PYRB_AVAILABLE:
            time_ratio = 1.0 / max(tempo_ratio, 1e-4)
            processed  = []
            for ch in range(data.shape[1]):
                processed.append(pyrb.time_stretch(data[:, ch], sr, time_ratio))
            min_len = min(len(c) for c in processed)
            data = np.column_stack([c[:min_len] for c in processed]).astype(np.float32)
        else:
            log.warning("pyrubberband absent — tempo ignoré pour %s", file_path)

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
        # Ne reconfigurer que si quelque chose change réellement
        changed = (
            (device_idx is not None and device_idx != mixer.device_index) or
            (channels   is not None and int(channels)   != mixer.channels)   or
            (samplerate is not None and int(samplerate) != mixer.sample_rate)
        )
        if changed:
            mixer.set_device(device_idx, channels, samplerate)
            log.info("Layout → %d canaux (stream démarrera au premier son)",
                     mixer.channels)
        # Ne pas démarrer le stream ici : cmd_play le fera avec le bon sample rate.
        await reply({"type": "device_set", "device": mixer.device_index,
                     "channels": mixer.channels, "changed": changed})

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

        # Démarrer le stream si nécessaire avec le taux natif du device
        if mixer.stream is None or not mixer.stream.active:
            if mixer.device_index is not None:
                # Utiliser le taux natif du device (JACK impose son propre clock)
                d = sd.query_devices(mixer.device_index)
                mixer.sample_rate = int(d["default_samplerate"])
            else:
                mixer.sample_rate = sr   # fallback : taux du fichier
            mixer.start_stream()

        # Rééchantillonner si le fichier n'est pas au taux du stream
        if sr != mixer.sample_rate and sr > 0:
            ratio   = mixer.sample_rate / sr
            new_len = max(1, int(round(len(data) * ratio)))
            x_old   = np.arange(len(data), dtype=np.float64)
            x_new   = np.linspace(0, len(data) - 1, new_len, dtype=np.float64)
            data    = np.column_stack([
                np.interp(x_new, x_old, data[:, ch]) for ch in range(data.shape[1])
            ]).astype(np.float32)
            log.debug("Rééchantillonnage %d→%d Hz (ratio %.4f)", sr, mixer.sample_rate, ratio)

        # Adapter le nombre de canaux de la voix à celui du stream
        # Les canaux supplémentaires sont mis à zéro (spatialisation JACK en aval)
        n_ch = data.shape[1]
        if n_ch < mixer.channels:
            padded = np.zeros((len(data), mixer.channels), dtype=np.float32)
            padded[:, :n_ch] = data
            data = padded
        elif n_ch > mixer.channels:
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

    # NSM / RaySession : s'annoncer si lancé dans une session
    if nsm.start():
        log.info("NSM: client démarré (url=%s)", nsm.url)

    # Auto-sélection JACK sur Linux : on retient uniquement le device,
    # PAS le nombre de canaux — c'est le layout du projet qui fait autorité.
    if sys.platform.startswith("linux"):
        jack_dev = find_jack_device()
        if jack_dev is not None:
            mixer.device_index = jack_dev
            d = sd.query_devices(jack_dev)
            log.info("JACK détecté → device [%d] %s (max %d ch) — "
                     "canaux effectifs définis par le layout projet",
                     jack_dev, d["name"], d["max_output_channels"])

        else:
            log.info("JACK non détecté, utilisation du device par défaut")

    # Le stream démarre au premier play (quand les canaux du layout sont connus).
    # Ne pas démarrer ici pour éviter une reconfiguration inutile.

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

    nsm.stop()
    # Sauvegarder les connexions JACK avant de fermer
    if sys.platform.startswith("linux"):
        jack_save_connections()
    log.info("Arrêt propre du serveur")


def main():
    try:
        asyncio.run(async_main())
    except KeyboardInterrupt:
        log.info("Interruption clavier")


if __name__ == "__main__":
    main()
