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


def cmd_process(plugin_path, in_path, out_path):
    data       = json.loads(sys.stdin.buffer.read())
    automation = data.get('automation', {})
    block_size = int(data.get('block_size', 1024))

    audio, sr = sf.read(in_path, dtype='float32', always_2d=True)
    n_samples  = audio.shape[0]
    n_channels = audio.shape[1]

    plugin = pedalboard.load_plugin(plugin_path)
    board  = pedalboard.Pedalboard([plugin])

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

        chunk = audio[offset:end].T           # (n_channels, block_len)
        out_chunk = board(chunk, sr, reset=first)
        first = False

        # Garantir 2D même si pedalboard retourne 1D
        if out_chunk.ndim == 1:
            out_chunk = out_chunk[np.newaxis, :]

        out_ch   = out_chunk.shape[0]
        out_samp = out_chunk.shape[1]
        copy_len = min(out_samp, end - offset)
        copy_ch  = min(out_ch, n_channels)

        output[offset:offset + copy_len, :copy_ch] = out_chunk[:copy_ch, :copy_len].T
        # canal manquant → duplique le dernier canal disponible
        for c in range(copy_ch, n_channels):
            output[offset:offset + copy_len, c] = out_chunk[copy_ch - 1, :copy_len]

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
