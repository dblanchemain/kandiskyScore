#!/usr/bin/env python3
"""
lv2_helper.py — Utilitaire LV2 pour kandiskyScore (liblilv via ctypes)

Remplace lv2proc : gère les ports atom/events_in (ex: Calf, LADSPA-wrappés, etc.)

Commandes :
  list                              → JSON liste des URIs LV2
  info  <uri>                       → JSON {name, uri, controlPorts:[{symbol,name,min,max,def}]}
  process <uri> <in.wav> <out.wav>  → traitement audio (JSON stdin : {automation,controlPorts,block_size})
"""

import sys, os, json, subprocess, traceback, math
import ctypes
import numpy as np
import soundfile as sf

# ── Chargement liblilv ────────────────────────────────────────────────────────
_L = ctypes.CDLL('liblilv-0.so.0')

_vp  = ctypes.c_void_p
_u32 = ctypes.c_uint32
_b   = ctypes.c_bool
_f32 = ctypes.c_float
_f64 = ctypes.c_double
_sp  = ctypes.c_char_p

def _sig(fn, res, *args):
    fn.restype = res; fn.argtypes = list(args)

_sig(_L.lilv_world_new,            _vp)
_sig(_L.lilv_world_load_all,       None, _vp)
_sig(_L.lilv_world_free,           None, _vp)
_sig(_L.lilv_new_uri,              _vp,  _vp, _sp)
_sig(_L.lilv_node_free,            None, _vp)
_sig(_L.lilv_node_as_string,       _sp,  _vp)
_sig(_L.lilv_node_is_float,        _b,   _vp)
_sig(_L.lilv_node_as_float,        _f32, _vp)
_sig(_L.lilv_world_get_all_plugins,_vp,  _vp)
_sig(_L.lilv_plugins_begin,        _vp,  _vp)
_sig(_L.lilv_plugins_next,         _vp,  _vp, _vp)
_sig(_L.lilv_plugins_is_end,       _b,   _vp, _vp)
_sig(_L.lilv_plugins_get,          _vp,  _vp, _vp)
_sig(_L.lilv_plugins_get_by_uri,   _vp,  _vp, _vp)
_sig(_L.lilv_plugin_get_name,      _vp,  _vp)
_sig(_L.lilv_plugin_get_num_ports, _u32, _vp)
_sig(_L.lilv_plugin_get_port_by_index, _vp, _vp, _u32)
_sig(_L.lilv_plugin_instantiate,   _vp,  _vp, _f64, _vp)
_sig(_L.lilv_instance_free,        None, _vp)
_sig(_L.lilv_port_is_a,            _b,   _vp, _vp, _vp)
_sig(_L.lilv_port_get_symbol,      _vp,  _vp, _vp)
_sig(_L.lilv_port_get_name,        _vp,  _vp, _vp)
_sig(_L.lilv_port_get_range,       None, _vp, _vp,
     ctypes.POINTER(_vp), ctypes.POINTER(_vp), ctypes.POINTER(_vp))
_sig(_L.lilv_plugin_get_port_ranges_float, None, _vp,
     ctypes.POINTER(_f32), ctypes.POINTER(_f32), ctypes.POINTER(_f32))

# ── Structures LV2 — tous les pointeurs de fonction en _vp pour détecter NULL ─
# LV2_Descriptor : URI, instantiate, connect_port, activate, run,
#                  deactivate, cleanup, extension_data
class _LV2Descriptor(ctypes.Structure):
    _fields_ = [
        ('URI',            _sp),
        ('instantiate',    _vp),
        ('connect_port',   _vp),
        ('activate',       _vp),
        ('run',            _vp),
        ('deactivate',     _vp),
        ('cleanup',        _vp),
        ('extension_data', _vp),
    ]

# LilvInstance : au moins lv2_descriptor + lv2_handle (champs internes après ignorés)
class _LilvInstance(ctypes.Structure):
    _fields_ = [
        ('lv2_descriptor', ctypes.POINTER(_LV2Descriptor)),
        ('lv2_handle',     _vp),
    ]

# Wrappers typés pour appel des fonctions du descripteur (vérifient NULL)
_VoidFnT = ctypes.CFUNCTYPE(None, _vp)
_ConnFnT = ctypes.CFUNCTYPE(None, _vp, _u32, _vp)
_RunFnT  = ctypes.CFUNCTYPE(None, _vp, _u32)

def _connect(desc, hdl, port, buf):
    _ConnFnT(desc.connect_port)(hdl, port, buf)

def _activate(desc, hdl):
    if desc.activate:
        _VoidFnT(desc.activate)(hdl)

def _run(desc, hdl, n):
    _RunFnT(desc.run)(hdl, n)

def _deactivate(desc, hdl):
    if desc.deactivate:
        _VoidFnT(desc.deactivate)(hdl)

# Type URIs LV2
_AUDIO  = b'http://lv2plug.in/ns/lv2core#AudioPort'
_CTRL   = b'http://lv2plug.in/ns/lv2core#ControlPort'
_INPUT  = b'http://lv2plug.in/ns/lv2core#InputPort'
_OUTPUT = b'http://lv2plug.in/ns/lv2core#OutputPort'


def _world():
    w = _L.lilv_world_new()
    _L.lilv_world_load_all(w)
    return w

def _urinode(world, b): return _L.lilv_new_uri(world, b)
def _nstr(node): return _L.lilv_node_as_string(node).decode('utf-8','replace') if node else None
def _nflt(node, d=0.0):
    return float(_L.lilv_node_as_float(node)) if (node and _L.lilv_node_is_float(node)) else d


def _get_plugin(world, uri_str):
    u = _urinode(world, uri_str.encode())
    p = _L.lilv_plugins_get_by_uri(_L.lilv_world_get_all_plugins(world), u)
    _L.lilv_node_free(u)
    if not p:
        raise RuntimeError(f'Plugin non trouvé : {uri_str}')
    return p


def _classify_ports(world, plugin):
    """Retourne (audio_in, audio_out, ctrl_in, ctrl_out, other) — listes d'indices."""
    n_a = _urinode(world, _AUDIO); n_c = _urinode(world, _CTRL)
    n_i = _urinode(world, _INPUT); n_o = _urinode(world, _OUTPUT)
    n   = _L.lilv_plugin_get_num_ports(plugin)
    a_in = []; a_out = []; c_in = []; c_out = []; other = []
    for i in range(n):
        port = _L.lilv_plugin_get_port_by_index(plugin, i)
        ia = _L.lilv_port_is_a(plugin, port, n_a)
        ic = _L.lilv_port_is_a(plugin, port, n_c)
        ii = _L.lilv_port_is_a(plugin, port, n_i)
        io = _L.lilv_port_is_a(plugin, port, n_o)
        if ia and ii: a_in.append(i)
        elif ia and io: a_out.append(i)
        elif ic and ii: c_in.append(i)
        elif ic and io: c_out.append(i)
        else: other.append(i)
    for n_ in [n_a, n_c, n_i, n_o]: _L.lilv_node_free(n_)
    return a_in, a_out, c_in, c_out, other


# ── Commandes ──────────────────────────────────────────────────────────────────

def cmd_list():
    r = subprocess.run(['lv2ls'], capture_output=True, text=True)
    print(json.dumps([l.strip() for l in r.stdout.splitlines() if l.strip()]))


def cmd_info(uri):
    world  = _world()
    plugin = _get_plugin(world, uri)
    nm_n   = _L.lilv_plugin_get_name(plugin)
    name   = _nstr(nm_n) or uri
    if nm_n: _L.lilv_node_free(nm_n)

    n = _L.lilv_plugin_get_num_ports(plugin)
    mn_arr  = (_f32 * n)(); df_arr = (_f32 * n)(); mx_arr = (_f32 * n)()
    # NaN = "pas de valeur définie"
    for i in range(n): mn_arr[i] = df_arr[i] = mx_arr[i] = float('nan')
    _L.lilv_plugin_get_port_ranges_float(plugin, mn_arr, df_arr, mx_arr)

    _, _, c_in, _, _ = _classify_ports(world, plugin)
    ports = []
    for i in c_in:
        port = _L.lilv_plugin_get_port_by_index(plugin, i)
        sym  = _nstr(_L.lilv_port_get_symbol(plugin, port)) or f'p{i}'
        nm_p = _L.lilv_port_get_name(plugin, port)
        nm   = _nstr(nm_p) or sym
        if nm_p: _L.lilv_node_free(nm_p)
        mn  = 0.0  if math.isnan(mn_arr[i]) else float(mn_arr[i])
        mx  = 1.0  if math.isnan(mx_arr[i]) else float(mx_arr[i])
        df  = 0.0  if math.isnan(df_arr[i]) else float(df_arr[i])
        ports.append({'symbol': sym, 'name': nm, 'def': df, 'min': mn, 'max': mx})

    print(json.dumps({'name': name, 'uri': uri, 'controlPorts': ports}))
    _L.lilv_world_free(world)


def _interp(events, t):
    if not events: return 0.0
    if t <= events[0][0]: return float(events[0][1])
    if t >= events[-1][0]: return float(events[-1][1])
    for i in range(len(events) - 1):
        t0, v0 = events[i][0], events[i][1]
        t1, v1 = events[i+1][0], events[i+1][1]
        mode = int(events[i][2]) if len(events[i]) > 2 else 0
        if t0 <= t < t1:
            frac = (t - t0) / (t1 - t0) if t1 > t0 else 1.0
            if mode == 1: return float(v0)
            if mode == 2:
                k = 4.0
                return float(v0 + (v1-v0)*(math.exp(k*frac)-1)/(math.exp(k)-1))
            if mode == 3: return float(v0 + (v1-v0)*frac*frac*(3-2*frac))
            return float(v0 + frac*(v1-v0))
    return float(events[-1][1])


def cmd_process(uri, in_path, out_path):
    data       = json.loads(sys.stdin.buffer.read())
    automation = data.get('automation', {})     # {sym: [[t,v,mode?], ...]}
    ctrl_static= data.get('controlPorts', {})   # {sym: value} valeurs statiques
    block_size = int(data.get('block_size', 1024))

    audio, sr = sf.read(in_path, dtype='float32', always_2d=True)
    n_samples, n_ch = audio.shape

    world  = _world()
    plugin = _get_plugin(world, uri)

    n_ports = _L.lilv_plugin_get_num_ports(plugin)
    mn_arr  = (_f32 * n_ports)(); df_arr = (_f32 * n_ports)(); mx_arr = (_f32 * n_ports)()
    for i in range(n_ports): mn_arr[i] = df_arr[i] = mx_arr[i] = float('nan')
    _L.lilv_plugin_get_port_ranges_float(plugin, mn_arr, df_arr, mx_arr)

    a_in, a_out, c_in, c_out, other = _classify_ports(world, plugin)

    # Instancier
    inst_ptr = _L.lilv_plugin_instantiate(plugin, float(sr), None)
    if not inst_ptr:
        raise RuntimeError('Échec instanciation plugin')
    inst = ctypes.cast(inst_ptr, ctypes.POINTER(_LilvInstance)).contents
    desc = inst.lv2_descriptor.contents
    hdl  = inst.lv2_handle

    # Ports de contrôle en entrée
    ctrl_floats = {}   # index → (c_float, symbol)
    sym_to_idx  = {}   # symbol → index
    for i in c_in:
        port = _L.lilv_plugin_get_port_by_index(plugin, i)
        sym  = _nstr(_L.lilv_port_get_symbol(plugin, port)) or f'p{i}'
        df   = 0.0 if math.isnan(df_arr[i]) else float(df_arr[i])
        if sym in automation and automation[sym]:
            df = float(automation[sym][0][1])
        elif sym in ctrl_static:
            df = float(ctrl_static[sym])
        f = ctypes.c_float(df)
        ctrl_floats[i] = (f, sym)
        sym_to_idx[sym] = i
        _connect(desc, hdl, i, ctypes.byref(f))

    # Ports de contrôle en sortie → float muet
    dummy_floats = []
    for i in c_out:
        f = ctypes.c_float(0.0)
        dummy_floats.append(f)
        _connect(desc, hdl, i, ctypes.byref(f))

    # Ports inconnus (atom, event, CV…) → buffer muet 4096 o (assez grand pour LV2_Atom)
    dummy_bufs = []
    for i in other:
        buf = (ctypes.c_uint8 * 4096)()
        dummy_bufs.append(buf)
        _connect(desc, hdl, i, buf)

    # Buffers audio — alloués comme tableaux C contigus (adresse stable)
    fp = ctypes.POINTER(ctypes.c_float)
    in_bufs  = [(ctypes.c_float * block_size)() for _ in a_in]
    out_bufs = [(ctypes.c_float * block_size)() for _ in a_out]
    for pi, idx in enumerate(a_in):
        _connect(desc, hdl, idx, in_bufs[pi])
    for pi, idx in enumerate(a_out):
        _connect(desc, hdl, idx, out_bufs[pi])

    _activate(desc, hdl)

    n_out_ch = max(len(a_out), n_ch)
    output   = np.zeros((n_samples, n_out_ch), dtype=np.float32)

    for off in range(0, n_samples, block_size):
        end  = min(off + block_size, n_samples)
        blen = end - off
        t_sec= off / sr

        # Automation
        for sym, events in automation.items():
            if sym in sym_to_idx:
                ctrl_floats[sym_to_idx[sym]][0].value = _interp(events, t_sec)

        # Audio en entrée
        for pi in range(len(a_in)):
            ch = pi % n_ch
            chunk = audio[off:end, ch]
            ctypes.memmove(in_bufs[pi], chunk.ctypes.data, blen * 4)
            if blen < block_size:
                ctypes.memset(ctypes.addressof(in_bufs[pi]) + blen * 4, 0,
                              (block_size - blen) * 4)

        _run(desc, hdl, block_size)

        for pi in range(len(a_out)):
            ch = pi % n_out_ch
            # Copie bloc → tableau numpy de sortie
            tmp = np.frombuffer(out_bufs[pi], dtype=np.float32)
            output[off:end, ch] = tmp[:blen]

    _deactivate(desc, hdl)
    _L.lilv_instance_free(inst_ptr)
    _L.lilv_world_free(world)

    # Aligner le nombre de canaux de sortie
    if output.shape[1] > n_ch:
        output = output[:, :n_ch]
    elif output.shape[1] < n_ch:
        last = output[:, -1:]
        output = np.hstack([output] + [last] * (n_ch - output.shape[1]))

    sf.write(out_path, output, sr, subtype='FLOAT')
    print(json.dumps({'ok': True}))


if __name__ == '__main__':
    os.environ['DISPLAY'] = ''
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    try:
        if cmd == 'list':
            cmd_list()
        elif cmd == 'info' and len(sys.argv) > 2:
            cmd_info(sys.argv[2])
        elif cmd == 'process' and len(sys.argv) > 4:
            cmd_process(sys.argv[2], sys.argv[3], sys.argv[4])
        else:
            sys.stderr.write('Usage: lv2_helper.py [list | info <uri> | process <uri> <in> <out>]\n')
            sys.exit(1)
    except Exception:
        sys.stderr.write(traceback.format_exc())
        sys.exit(2)
