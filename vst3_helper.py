#!/usr/bin/env python3
"""
vst3_helper.py — Utilitaire VST3 pour kandiskyScore (via pedalboard)

Commandes :
  list                            → JSON liste des chemins .vst3
  info  <plugin.vst3>             → JSON {name, path, params:[{name,min,max,default,units}]}
  process <plugin.vst3> <in.wav> <out.wav>
                                  → traitement audio avec automation (JSON sur stdin)

Format JSON stdin pour process :
  {
    "automation": { "param_name": [[t_sec, value, mode?], ...], ... },
    "block_size": 1024
  }
  Modes : 0=linéaire 1=step 2=exponentiel 3=ease-in-out (même convention que l'automation WAM)
"""

import sys
import os
import json
import glob
import traceback

import numpy as np
import soundfile as sf
import pedalboard

# Répertoires VST3 standard Linux
VST3_DIRS = [
    os.path.expanduser('~/.vst3'),
    '/usr/lib/vst3',
    '/usr/local/lib/vst3',
]
# Chemins supplémentaires via Préférences > Externes > Path VST3
for _p in os.environ.get('KANDISKYSCORE_VST3_PATH', '').split(':'):
    _p = _p.strip()
    if _p and _p not in VST3_DIRS:
        VST3_DIRS.append(_p)


def cmd_list():
    paths = set()
    for d in VST3_DIRS:
        if not os.path.isdir(d):
            continue
        for entry in os.listdir(d):
            if entry.endswith('.vst3'):
                paths.add(os.path.join(d, entry))
    print(json.dumps(sorted(paths)))


def cmd_info(plugin_path):
    plugin = pedalboard.load_plugin(plugin_path)
    ports = []
    skip = {'buffer_size_frames', 'sample_rate_frames'}
    for name, param in plugin.parameters.items():
        if name in skip:
            continue
        try:
            val = getattr(plugin, name)
            if param.min_value is not None:
                ports.append({
                    'name':    name,
                    'min':     float(param.min_value),
                    'max':     float(param.max_value),
                    'default': float(val) if isinstance(val, (int, float)) else 0.0,
                    'units':   param.units or '',
                })
        except Exception:
            pass
    name = os.path.splitext(os.path.basename(plugin_path))[0]
    print(json.dumps({'name': name, 'path': plugin_path, 'params': ports}))


def _interp(events, t):
    """Évalue un paramètre d'automation à l'instant t."""
    if not events:
        return 0.0
    if t <= events[0][0]:
        return float(events[0][1])
    if t >= events[-1][0]:
        return float(events[-1][1])
    for i in range(len(events) - 1):
        ev_a = events[i]
        ev_b = events[i + 1]
        t0, v0 = ev_a[0], ev_a[1]
        t1, v1 = ev_b[0], ev_b[1]
        mode   = int(ev_a[2]) if len(ev_a) > 2 else 0
        if t0 <= t < t1:
            frac = (t - t0) / (t1 - t0) if t1 > t0 else 1.0
            if mode == 1:   # step
                return float(v0)
            elif mode == 2:  # exp
                k = 4.0
                return float(v0 + (v1 - v0) * (np.exp(k * frac) - 1) / (np.exp(k) - 1))
            elif mode == 3:  # ease-in-out
                return float(v0 + (v1 - v0) * frac * frac * (3 - 2 * frac))
            else:            # linéaire
                return float(v0 + frac * (v1 - v0))
    return float(events[-1][1])


def _probe_plugin_channels(board, sr, block_size):
    """Retourne le nombre de canaux (entrée=sortie) accepté par le plugin."""
    for n in (2, 1, 4, 6, 8):
        probe = np.zeros((n, min(block_size, 512)), dtype=np.float32)
        try:
            board(probe, sr, reset=True)
            return n
        except (ValueError, RuntimeError):
            continue
    return 2


def _adapt_channels(chunk, target_ch):
    """(src_ch, samples) → (target_ch, samples) par downmix/upmix."""
    src_ch = chunk.shape[0]
    if src_ch == target_ch:
        return chunk
    if src_ch > target_ch:
        # downmix : moyenne des groupes de canaux
        if src_ch % target_ch == 0:
            return chunk.reshape(target_ch, src_ch // target_ch, -1).mean(axis=1)
        result = chunk[:target_ch].copy()
        for i in range(target_ch, src_ch):
            result[i % target_ch] += chunk[i]
        result /= (src_ch / target_ch)
        return result
    # upmix : répétition des canaux
    repeats = (target_ch + src_ch - 1) // src_ch
    return np.tile(chunk, (repeats, 1))[:target_ch]


def cmd_process(plugin_path, in_path, out_path):
    data       = json.loads(sys.stdin.buffer.read())
    automation = data.get('automation', {})
    block_size = int(data.get('block_size', 1024))

    audio, sr = sf.read(in_path, dtype='float32', always_2d=True)
    n_samples  = audio.shape[0]
    n_channels = audio.shape[1]

    plugin    = pedalboard.load_plugin(plugin_path)
    board     = pedalboard.Pedalboard([plugin])
    plugin_ch = _probe_plugin_channels(board, sr, block_size)

    output = np.zeros((n_samples, n_channels), dtype=np.float32)

    offset = 0
    first  = True
    while offset < n_samples:
        end   = min(offset + block_size, n_samples)
        t_sec = offset / sr

        for param_name, events in automation.items():
            val = _interp(events, t_sec)
            try:
                setattr(plugin, param_name, val)
            except Exception:
                pass

        chunk = audio[offset:end].T                     # (n_channels, block_len)
        chunk = _adapt_channels(chunk, plugin_ch)       # → (plugin_ch, block_len)
        out_chunk = board(chunk, sr, reset=first)
        first = False

        if out_chunk.ndim == 1:
            out_chunk = out_chunk[np.newaxis, :]

        out_ch   = out_chunk.shape[0]
        out_samp = out_chunk.shape[1]
        copy_len = min(out_samp, end - offset)

        # Upmix/downmix la sortie vers n_channels
        out_adapted = _adapt_channels(out_chunk[:, :copy_len], n_channels)
        output[offset:offset + copy_len] = out_adapted.T

        offset = end

    sf.write(out_path, output, sr, subtype='FLOAT')
    print(json.dumps({'ok': True}))


if __name__ == '__main__':
    os.environ['DISPLAY'] = ''   # headless
    cmd = sys.argv[1] if len(sys.argv) > 1 else 'help'
    try:
        if cmd == 'list':
            cmd_list()
        elif cmd == 'info' and len(sys.argv) > 2:
            cmd_info(sys.argv[2])
        elif cmd == 'process' and len(sys.argv) > 4:
            cmd_process(sys.argv[2], sys.argv[3], sys.argv[4])
        else:
            sys.stderr.write('Usage: vst3_helper.py [list | info <path> | process <plugin> <in> <out>]\n')
            sys.exit(1)
    except Exception:
        sys.stderr.write(traceback.format_exc())
        sys.exit(2)
