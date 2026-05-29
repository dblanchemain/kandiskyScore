#!/usr/bin/env python3
"""
lv2_ui_gtk2.py — Fenêtre GTK2 native pour plugin LV2 via suil (GTK2UI-in-GTK2).
Usage: python3 lv2_ui_gtk2.py <uri> [initial_json]
  Stdout (JSON lignes): {"ready":true} | {"idx":N,"sym":"...","value":V} | {"closed":true} | {"error":...}
"""

import sys, os, json, ctypes, time, traceback
from urllib.parse import unquote

_script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _script_dir)
from lv2_helper import (_L, _vp, _sp, _u32, _f32, _b,
                        _world, _get_plugin, _classify_ports, _nstr,
                        _urinode)

_i = ctypes.c_int

def _sig(fn, res, *args):
    fn.restype = res
    fn.argtypes = list(args)

# ── LV2_Descriptor (DSP) ─────────────────────────────────────────────────────
class _LV2_Descriptor(ctypes.Structure):
    pass

_LV2_Descriptor._fields_ = [
    ('URI',            _sp),
    ('instantiate',    _vp),
    ('connect_port',   _vp),
    ('activate',       _vp),
    ('run',            _vp),
    ('deactivate',     _vp),
    ('cleanup',        _vp),
    ('extension_data', _vp),
]
_InstFn    = ctypes.CFUNCTYPE(_vp,  ctypes.c_void_p, ctypes.c_double, _sp, _vp)
_CleanupFn = ctypes.CFUNCTYPE(None, _vp)


def _uri_to_path(node):
    s = _nstr(node) or ''
    if s.startswith('file://'):
        return unquote(s[7:])
    return s


def _instantiate_dsp(plugin, uri, bundle_path_b, features_ptr):
    try:
        _sig(_L.lilv_plugin_get_library_uri, _vp, _vp)
        lib_node = _L.lilv_plugin_get_library_uri(plugin)
        lib_path = _uri_to_path(lib_node) if lib_node else None
        if lib_node:
            _L.lilv_node_free(lib_node)
        if not lib_path or not os.path.exists(lib_path):
            return None, None, None

        lib = ctypes.CDLL(lib_path)
        lib.lv2_descriptor.restype  = ctypes.POINTER(_LV2_Descriptor)
        lib.lv2_descriptor.argtypes = [ctypes.c_uint32]

        target = uri.encode() if isinstance(uri, str) else uri
        for idx in range(200):
            desc_ptr = lib.lv2_descriptor(idx)
            if not desc_ptr:
                break
            if desc_ptr.contents.URI == target:
                inst_fn = _InstFn(desc_ptr.contents.instantiate)
                handle  = inst_fn(ctypes.cast(desc_ptr, _vp), 44100.0, bundle_path_b, features_ptr)
                return handle, desc_ptr, lib
    except Exception as e:
        sys.stderr.write(f'[lv2_ui_gtk2] _instantiate_dsp erreur: {e}\n')
    return None, None, None


# ── Signatures liblilv : UI ───────────────────────────────────────────────────
_sig(_L.lilv_plugin_get_uis,    _vp,  _vp)
_sig(_L.lilv_uis_free,          None, _vp)
_sig(_L.lilv_uis_size,          _u32, _vp)
_sig(_L.lilv_uis_begin,         _vp,  _vp)
_sig(_L.lilv_uis_is_end,        _b,   _vp, _vp)
_sig(_L.lilv_uis_get,           _vp,  _vp, _vp)
_sig(_L.lilv_uis_next,          _vp,  _vp, _vp)
_sig(_L.lilv_ui_get_uri,        _vp,  _vp)
_sig(_L.lilv_ui_get_bundle_uri, _vp,  _vp)
_sig(_L.lilv_ui_get_binary_uri, _vp,  _vp)
_sig(_L.lilv_ui_is_a,           _b,   _vp, _vp)

# ── libsuil ───────────────────────────────────────────────────────────────────
_S = ctypes.CDLL('libsuil-0.so.0')

WriteFn = ctypes.CFUNCTYPE(None, _vp, _u32, _u32, _u32, _vp)

_sig(_S.suil_init,                    None,          ctypes.c_void_p, ctypes.c_void_p, _i)
_sig(_S.suil_host_new,                _vp,           WriteFn, _vp, _vp, _vp)
_sig(_S.suil_host_free,               None,          _vp)
_sig(_S.suil_instance_new,            _vp,           _vp, _vp, _sp, _sp, _sp, _sp, _sp, _sp, _vp)
_sig(_S.suil_instance_get_widget,     _vp,           _vp)
_sig(_S.suil_instance_get_handle,     _vp,           _vp)
_sig(_S.suil_instance_extension_data, _vp,           _vp, _sp)
_sig(_S.suil_instance_port_event,     None,          _vp, _u32, _u32, _u32, _vp)
_sig(_S.suil_instance_free,           None,          _vp)
_sig(_S.suil_ui_supported,            ctypes.c_uint, _sp, _sp)

class _IdleIface(ctypes.Structure):
    _fields_ = [('idle', ctypes.CFUNCTYPE(ctypes.c_int, _vp))]

# ── libgtk-x11-2.0 / libgobject / libglib ────────────────────────────────────
_G2 = ctypes.CDLL('libgtk-x11-2.0.so.0')
_GO = ctypes.CDLL('libgobject-2.0.so.0')
_GL = ctypes.CDLL('libglib-2.0.so.0')

_sig(_G2.gtk_init,                    None,           ctypes.c_void_p, ctypes.c_void_p)
_sig(_G2.gtk_window_new,              _vp,            _i)
_sig(_G2.gtk_window_set_title,        None,           _vp, _sp)
_sig(_G2.gtk_window_set_default_size, None,           _vp, _i, _i)
_sig(_G2.gtk_container_add,           None,           _vp, _vp)
_sig(_G2.gtk_widget_show_all,         None,           _vp)
_sig(_GO.g_signal_connect_data,       ctypes.c_ulong, _vp, _sp, _vp, _vp, _vp, _i)
_sig(_GL.g_main_context_iteration,    _b,             _vp, _b)

# ── Constante UI LV2 ─────────────────────────────────────────────────────────
_GTK2_URI = b'http://lv2plug.in/ns/extensions/ui#GtkUI'


def _find_gtk2_ui(world, plugin):
    uis = _L.lilv_plugin_get_uis(plugin)
    if not uis or _L.lilv_uis_size(uis) == 0:
        if uis:
            _L.lilv_uis_free(uis)
        return None

    result = None
    it = _L.lilv_uis_begin(uis)
    while not _L.lilv_uis_is_end(uis, it):
        ui      = _L.lilv_uis_get(uis, it)
        n_gtk2  = _urinode(world, _GTK2_URI)
        is_gtk2 = _L.lilv_ui_is_a(ui, n_gtk2)
        _L.lilv_node_free(n_gtk2)
        if is_gtk2:
            ui_uri_node = _L.lilv_ui_get_uri(ui)
            bundle_node = _L.lilv_ui_get_bundle_uri(ui)
            binary_node = _L.lilv_ui_get_binary_uri(ui)
            ui_uri_str  = _nstr(ui_uri_node)
            bundle_path = _uri_to_path(bundle_node)
            binary_path = _uri_to_path(binary_node)
            if ui_uri_str and bundle_path and binary_path:
                result = (ui_uri_str.encode(), _GTK2_URI,
                          bundle_path.encode(), binary_path.encode())
                break
        it = _L.lilv_uis_next(uis, it)

    _L.lilv_uis_free(uis)
    return result


def _dbg(msg):
    sys.stderr.write(f'[lv2_ui_gtk2] {msg}\n')
    sys.stderr.flush()


def cmd_ui(uri, initial_str=None):
    initial = {}
    if initial_str:
        try:
            initial = json.loads(initial_str)
        except Exception:
            pass

    _dbg(f'démarrage pour {uri}')

    _G2.gtk_init(None, None)
    _S.suil_init(None, None, 0)
    _dbg('GTK2 + suil initialisés')

    world  = _world()
    plugin = _get_plugin(world, uri)

    nm_n = _L.lilv_plugin_get_name(plugin)
    plugin_name = _nstr(nm_n) or uri
    if nm_n:
        _L.lilv_node_free(nm_n)
    _dbg(f'plugin: {plugin_name}')

    _, _, c_in, _, _ = _classify_ports(world, plugin)

    idx_to_sym = {}
    sym_to_idx = {}
    for i in c_in:
        port = _L.lilv_plugin_get_port_by_index(plugin, i)
        sym  = _nstr(_L.lilv_port_get_symbol(plugin, port)) or f'p{i}'
        idx_to_sym[i] = sym
        sym_to_idx[sym] = i

    ui_info = _find_gtk2_ui(world, plugin)
    if not ui_info:
        _dbg('aucune UI GTK2 trouvée')
        print(json.dumps({'error': 'no_ui',
                          'message': f'{plugin_name} : aucune UI GTK2 trouvée'}), flush=True)
        _L.lilv_world_free(world)
        return

    ui_uri_b, ui_type_b, bundle_path_b, binary_path_b = ui_info
    _dbg(f'UI GTK2 trouvée: {ui_uri_b}')

    # ── LV2_URID_Map ──────────────────────────────────────────────────────────
    MapFnType = ctypes.CFUNCTYPE(ctypes.c_uint32, ctypes.c_void_p, ctypes.c_char_p)

    class _URIDMapData(ctypes.Structure):
        _fields_ = [('handle', _vp), ('map', MapFnType)]

    class _LV2Feature(ctypes.Structure):
        _fields_ = [('URI', _sp), ('data', _vp)]

    urid_dict = {}
    urid_next = [1]

    def _map_uri(handle, uri_bytes):
        k = uri_bytes.decode('utf-8', 'replace') if uri_bytes else ''
        if k not in urid_dict:
            urid_dict[k] = urid_next[0]
            urid_next[0] += 1
        return urid_dict[k]

    map_cb   = MapFnType(_map_uri)
    urid_map = _URIDMapData(None, map_cb)

    feat_urid = _LV2Feature(
        b'http://lv2plug.in/ns/ext/urid#map',
        ctypes.cast(ctypes.pointer(urid_map), _vp)
    )

    features_arr = (ctypes.c_void_p * 2)(
        ctypes.cast(ctypes.pointer(feat_urid), ctypes.c_void_p),
        None
    )

    # ── instance-access ───────────────────────────────────────────────────────
    dsp_handle, dsp_desc_ptr, dsp_lib = _instantiate_dsp(
        plugin, uri, bundle_path_b, ctypes.cast(features_arr, _vp)
    )
    if dsp_handle:
        feat_inst = _LV2Feature(
            b'http://lv2plug.in/ns/ext/instance-access',
            dsp_handle
        )
        features_arr = (ctypes.c_void_p * 3)(
            ctypes.cast(ctypes.pointer(feat_urid), ctypes.c_void_p),
            ctypes.cast(ctypes.pointer(feat_inst), ctypes.c_void_p),
            None
        )
        _dbg(f'instance-access fourni (handle={dsp_handle})')
    else:
        _dbg('instance-access non disponible')

    # ── Callback suil ─────────────────────────────────────────────────────────
    def write_fn(controller, port_index, buffer_size, protocol, buffer):
        if protocol == 0 and buffer_size >= 4 and buffer:
            try:
                value = ctypes.cast(buffer, ctypes.POINTER(_f32)).contents.value
                sym   = idx_to_sym.get(port_index, f'port_{port_index}')
                print(json.dumps({'idx': int(port_index), 'sym': sym, 'value': float(value)}), flush=True)
            except Exception as e:
                _dbg(f'write_fn erreur: {e}')

    write_cb = WriteFn(write_fn)
    host     = _S.suil_host_new(write_cb, None, None, None)

    binary_path_str = binary_path_b.decode()
    if not os.path.exists(binary_path_str):
        print(json.dumps({'error': 'binary_missing',
                          'message': f'UI binary introuvable : {binary_path_str}'}), flush=True)
        _S.suil_host_free(host)
        _L.lilv_world_free(world)
        return

    # controller non-NULL : FRUT v2.0.0 vérifie (writeFunction && controller)
    _ctrl_dummy = ctypes.c_uint8(0)
    instance = _S.suil_instance_new(
        host, ctypes.addressof(_ctrl_dummy),
        _GTK2_URI,
        uri.encode(), ui_uri_b, ui_type_b,
        bundle_path_b, binary_path_b,
        ctypes.cast(features_arr, _vp)
    )

    if not instance:
        _dbg('suil_instance_new a retourné NULL')
        print(json.dumps({'error': 'suil_error',
                          'message': 'suil_instance_new a échoué pour UI GTK2'}), flush=True)
        _S.suil_host_free(host)
        _L.lilv_world_free(world)
        return

    _dbg('suil instance créée')
    widget_ptr = _S.suil_instance_get_widget(instance)

    # ── ui:idleInterface ──────────────────────────────────────────────────────
    _IDLE_URI   = b'http://lv2plug.in/ns/ext/ui#idleInterface'
    _idle_iface = None
    _ui_handle  = None

    class _LV2UI_Descriptor(ctypes.Structure):
        _fields_ = [
            ('URI',            _sp),
            ('instantiate',    _vp),
            ('cleanup',        _vp),
            ('port_event',     _vp),
            ('extension_data', _vp),
        ]
    _ExtDataFn = ctypes.CFUNCTYPE(_vp, _sp)

    try:
        _ui_lib = ctypes.CDLL(binary_path_str)
        _ui_lib.lv2ui_descriptor.restype  = ctypes.POINTER(_LV2UI_Descriptor)
        _ui_lib.lv2ui_descriptor.argtypes = [ctypes.c_uint32]
        for _idx in range(100):
            _dp = _ui_lib.lv2ui_descriptor(_idx)
            if not _dp:
                break
            if _dp.contents.URI == ui_uri_b:
                if _dp.contents.extension_data:
                    _idle_ptr = _ExtDataFn(_dp.contents.extension_data)(_IDLE_URI)
                    if _idle_ptr:
                        _idle_iface = ctypes.cast(_idle_ptr, ctypes.POINTER(_IdleIface)).contents
                        _ui_handle  = _S.suil_instance_get_handle(instance)
                        _dbg('idle interface directe trouvée')
                break
    except Exception as e:
        _dbg(f'accès direct UI descriptor: {e}')

    if not _idle_iface:
        _dbg('idle interface non disponible')

    # ── Fenêtre GTK2 ──────────────────────────────────────────────────────────
    window = _G2.gtk_window_new(0)   # GTK_WINDOW_TOPLEVEL
    _G2.gtk_window_set_title(window, plugin_name.encode())
    _G2.gtk_window_set_default_size(window, 400, 300)
    _G2.gtk_container_add(window, widget_ptr)
    _G2.gtk_widget_show_all(window)
    _dbg('fenêtre GTK2 affichée')

    stop = [False]
    DestroyCb = ctypes.CFUNCTYPE(None, ctypes.c_void_p, ctypes.c_void_p)

    def on_destroy(w, d):
        stop[0] = True

    destroy_cb = DestroyCb(on_destroy)
    _GO.g_signal_connect_data(window, b'destroy', destroy_cb, None, None, 0)

    # Quelques itérations pour réaliser le widget avant d'envoyer les valeurs initiales
    for _ in range(8):
        _GL.g_main_context_iteration(None, ctypes.c_bool(False))
    for sym, value in initial.items():
        idx = sym_to_idx.get(sym)
        if idx is not None:
            v = (_f32 * 1)(float(value))
            _S.suil_instance_port_event(instance, idx, 4, 0, ctypes.cast(v, _vp))

    print(json.dumps({'ready': True}), flush=True)
    _dbg('prêt, boucle principale')

    # ── Boucle principale ─────────────────────────────────────────────────────
    while not stop[0]:
        _GL.g_main_context_iteration(None, ctypes.c_bool(False))
        if _idle_iface and _ui_handle:
            _idle_iface.idle(_ui_handle)
        time.sleep(0.005)

    # ── Nettoyage ─────────────────────────────────────────────────────────────
    _S.suil_instance_free(instance)
    _S.suil_host_free(host)
    if dsp_handle and dsp_desc_ptr:
        try:
            _CleanupFn(dsp_desc_ptr.contents.cleanup)(dsp_handle)
        except Exception:
            pass
    _L.lilv_world_free(world)
    print(json.dumps({'closed': True}), flush=True)


if __name__ == '__main__':
    if len(sys.argv) < 2:
        sys.stderr.write('Usage: lv2_ui_gtk2.py <uri> [initial_json]\n')
        sys.exit(1)
    _uri = sys.argv[1]
    _init_str = sys.argv[2] if len(sys.argv) > 2 else None
    try:
        cmd_ui(_uri, _init_str)
    except Exception:
        tb = traceback.format_exc()
        sys.stderr.write(tb)
        print(json.dumps({'error': 'exception', 'message': tb}), flush=True)
        sys.exit(2)
