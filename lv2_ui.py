#!/usr/bin/env python3
"""
lv2_ui.py — Fenêtre GTK3 native pour plugin LV2 via suil (X11-in-GTK3).
Usage: python3 lv2_ui.py <uri> [initial_json]
  Stdout (JSON lignes): {"ready":true} | {"idx":N,"sym":"...","value":V} | {"closed":true} | {"error":...}
"""

import sys, os, json, ctypes, time, traceback
from urllib.parse import unquote

# ── Partager le setup lilv depuis lv2_helper ───────────────────────────────
_script_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, _script_dir)
from lv2_helper import (_L, _vp, _sp, _u32, _f32, _b,
                        _world, _get_plugin, _classify_ports, _nstr,
                        _urinode)

_i = ctypes.c_int

def _sig(fn, res, *args):
    fn.restype = res
    fn.argtypes = list(args)

# ── LV2_Descriptor (DSP) ──────────────────────────────────────────────────────
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

def _instantiate_dsp(plugin, uri, bundle_path_b, features_ptr):
    """
    Charge la bibliothèque DSP du plugin et instancie-le (pour instance-access).
    Retourne (handle, desc_ptr, lib) ou (None, None, None).
    """
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
        sys.stderr.write(f'[lv2_ui] _instantiate_dsp erreur: {e}\n')
    return None, None, None

# ── Signatures liblilv : UI ────────────────────────────────────────────────
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

# ── libsuil ────────────────────────────────────────────────────────────────
_S = ctypes.CDLL('libsuil-0.so.0')

WriteFn = ctypes.CFUNCTYPE(None, _vp, _u32, _u32, _u32, _vp)

_sig(_S.suil_init,                 None,          ctypes.c_void_p, ctypes.c_void_p, _i)
_sig(_S.suil_host_new,             _vp,           WriteFn, _vp, _vp, _vp)
_sig(_S.suil_host_free,            None,          _vp)
_sig(_S.suil_instance_new,         _vp,           _vp, _vp, _sp, _sp, _sp, _sp, _sp, _sp, _vp)
_sig(_S.suil_instance_get_widget,  _vp,           _vp)
_sig(_S.suil_instance_port_event,  None,          _vp, _u32, _u32, _u32, _vp)
_sig(_S.suil_instance_free,        None,          _vp)
_sig(_S.suil_ui_supported,         ctypes.c_uint, _sp, _sp)

# ── libgtk-3 / libgobject / libglib ────────────────────────────────────────
_G3 = ctypes.CDLL('libgtk-3.so.0')
_GO = ctypes.CDLL('libgobject-2.0.so.0')
_GL = ctypes.CDLL('libglib-2.0.so.0')

_sig(_G3.gtk_init,                   None,          ctypes.c_void_p, ctypes.c_void_p)
_sig(_G3.gtk_window_new,             _vp,           _i)
_sig(_G3.gtk_window_set_title,       None,          _vp, _sp)
_sig(_G3.gtk_window_set_default_size,None,          _vp, _i, _i)
_sig(_G3.gtk_container_add,          None,          _vp, _vp)
_sig(_G3.gtk_widget_show_all,        None,          _vp)
_sig(_GO.g_signal_connect_data,      ctypes.c_ulong,_vp, _sp, _vp, _vp, _vp, _i)
_sig(_GL.g_main_context_iteration,   _b,            _vp, _b)

# ── Constantes UI LV2 ──────────────────────────────────────────────────────
_GTK3_URI = b'http://lv2plug.in/ns/extensions/ui#Gtk3UI'
_X11_URI  = b'http://lv2plug.in/ns/extensions/ui#X11UI'
_GTK2_URI = b'http://lv2plug.in/ns/extensions/ui#GtkUI'

# Types de UI testés dans cet ordre de préférence
_CANDIDATE_UI_TYPES = [_X11_URI, _GTK2_URI]


def _uri_to_path(node):
    """Convertit un nœud lilv file:// en chemin filesystem."""
    s = _nstr(node) or ''
    if s.startswith('file://'):
        return unquote(s[7:])
    return s


def _find_supported_ui(world, plugin):
    """
    Cherche une UI LV2 supportable via suil+GTK3.
    Retourne (ui_uri_b, ui_type_b, bundle_path_b, binary_path_b) ou (None, 'gtk2', None, None) si GTK2 seulement.
    """
    uis = _L.lilv_plugin_get_uis(plugin)
    if not uis or _L.lilv_uis_size(uis) == 0:
        if uis:
            _L.lilv_uis_free(uis)
        return None

    # Vérifier si le plugin a une UI GTK2 (non supportée) mais pas X11
    has_gtk2 = False

    result = None
    it = _L.lilv_uis_begin(uis)
    while not _L.lilv_uis_is_end(uis, it):
        ui = _L.lilv_uis_get(uis, it)
        # Détecter GTK2 (non embarquable dans GTK3)
        n_gtk2 = _urinode(world, _GTK2_URI)
        if _L.lilv_ui_is_a(ui, n_gtk2):
            has_gtk2 = True
        _L.lilv_node_free(n_gtk2)
        for ui_type in _CANDIDATE_UI_TYPES:
            if _S.suil_ui_supported(_GTK3_URI, ui_type) == 0:
                continue
            n_type = _urinode(world, ui_type)
            is_match = _L.lilv_ui_is_a(ui, n_type)
            _L.lilv_node_free(n_type)
            if not is_match:
                continue
            ui_uri_node  = _L.lilv_ui_get_uri(ui)
            bundle_node  = _L.lilv_ui_get_bundle_uri(ui)
            binary_node  = _L.lilv_ui_get_binary_uri(ui)
            ui_uri_str   = _nstr(ui_uri_node)
            bundle_path  = _uri_to_path(bundle_node)
            binary_path  = _uri_to_path(binary_node)
            if ui_uri_str and bundle_path and binary_path:
                result = (ui_uri_str.encode(), ui_type,
                          bundle_path.encode(), binary_path.encode())
            break
        if result:
            break
        it = _L.lilv_uis_next(uis, it)

    _L.lilv_uis_free(uis)
    if result is None and has_gtk2:
        return (None, 'gtk2', None, None)   # signal explicite
    return result


def _dbg(msg):
    sys.stderr.write(f'[lv2_ui] {msg}\n')
    sys.stderr.flush()


def cmd_ui(uri, initial_str=None):
    initial = {}
    if initial_str:
        try:
            initial = json.loads(initial_str)
        except Exception:
            pass

    _dbg(f'démarrage pour {uri}')

    # ── Init GTK + suil ──────────────────────────────────────────────────
    _G3.gtk_init(None, None)
    _S.suil_init(None, None, 0)   # SUIL_ARG_NONE = 0
    _dbg('GTK + suil initialisés')

    # ── Charger le plugin ────────────────────────────────────────────────
    world  = _world()
    plugin = _get_plugin(world, uri)

    nm_n = _L.lilv_plugin_get_name(plugin)
    plugin_name = _nstr(nm_n) or uri
    if nm_n:
        _L.lilv_node_free(nm_n)
    _dbg(f'plugin: {plugin_name}')

    # ── Index des ports de contrôle ──────────────────────────────────────
    n_ports = _L.lilv_plugin_get_num_ports(plugin)
    _, _, c_in, _, _ = _classify_ports(world, plugin)

    idx_to_sym = {}
    sym_to_idx = {}
    for i in c_in:
        port = _L.lilv_plugin_get_port_by_index(plugin, i)
        sym  = _nstr(_L.lilv_port_get_symbol(plugin, port)) or f'p{i}'
        idx_to_sym[i] = sym
        sym_to_idx[sym] = i

    # ── Trouver une UI native ────────────────────────────────────────────
    ui_info = _find_supported_ui(world, plugin)
    if not ui_info:
        _dbg('aucune UI native trouvée')
        print(json.dumps({'error': 'no_ui',
                          'message': f'{plugin_name} : aucune UI native trouvée'}), flush=True)
        _L.lilv_world_free(world)
        return

    ui_uri_b, ui_type_b, bundle_path_b, binary_path_b = ui_info

    if ui_type_b == 'gtk2':
        _dbg('UI GTK2 non supportée par suil+GTK3')
        print(json.dumps({'error': 'gtk2_unsupported',
                          'message': f'{plugin_name} : UI GTK2 non embarquable dans GTK3 — pas de fenêtre native disponible'}), flush=True)
        _L.lilv_world_free(world)
        return

    _dbg(f'UI trouvée: {ui_uri_b} type={ui_type_b} bundle={bundle_path_b}')

    # ── LV2_URID_Map (feature requise par la plupart des UIs) ─────────
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

    # Tableau de features minimal (urid#map) pour l'instanciation DSP
    features_arr = (ctypes.c_void_p * 2)(
        ctypes.cast(ctypes.pointer(feat_urid), ctypes.c_void_p),
        None
    )

    # ── instance-access : instancier le DSP pour les UIs qui l'exigent ───
    dsp_handle, dsp_desc_ptr, dsp_lib = _instantiate_dsp(
        plugin, uri, bundle_path_b, ctypes.cast(features_arr, _vp)
    )
    if dsp_handle:
        feat_inst = _LV2Feature(
            b'http://lv2plug.in/ns/ext/instance-access',
            dsp_handle
        )
        features_arr = (ctypes.c_void_p * 3)(
            ctypes.cast(ctypes.pointer(feat_urid),  ctypes.c_void_p),
            ctypes.cast(ctypes.pointer(feat_inst),  ctypes.c_void_p),
            None
        )
        _dbg(f'instance-access fourni (handle={dsp_handle})')
    else:
        _dbg('instance-access non disponible')

    # ── Callback suil : changements de ports ─────────────────────────────
    def write_fn(controller, port_index, buffer_size, protocol, buffer):
        # protocol=0 → float brut (LV2_ATOM__Float)
        if protocol == 0 and buffer_size >= 4 and buffer:
            try:
                value = ctypes.cast(buffer, ctypes.POINTER(_f32)).contents.value
                sym   = idx_to_sym.get(port_index, f'port_{port_index}')
                print(json.dumps({'idx': int(port_index), 'sym': sym, 'value': float(value)}), flush=True)
            except Exception as e:
                _dbg(f'write_fn erreur: {e}')

    write_cb = WriteFn(write_fn)
    host     = _S.suil_host_new(write_cb, None, None, None)
    _dbg('suil host créé')

    # ── Vérifications avant suil_instance_new ───────────────────────────
    supported = _S.suil_ui_supported(_GTK3_URI, ui_type_b)
    _dbg(f'suil_ui_supported={supported}')

    binary_path_str = binary_path_b.decode() if isinstance(binary_path_b, bytes) else binary_path_b
    bundle_path_str = bundle_path_b.decode() if isinstance(bundle_path_b, bytes) else bundle_path_b
    binary_exists = os.path.exists(binary_path_str)
    _dbg(f'binary_path={binary_path_str!r} exists={binary_exists}')
    _dbg(f'bundle_path={bundle_path_str!r}')

    if not binary_exists:
        print(json.dumps({'error': 'binary_missing',
                          'message': f'UI binary introuvable : {binary_path_str}'}), flush=True)
        _S.suil_host_free(host)
        _L.lilv_world_free(world)
        return

    # ── Instance suil ────────────────────────────────────────────────────
    instance = _S.suil_instance_new(
        host, None,
        _GTK3_URI,
        uri.encode(), ui_uri_b, ui_type_b,
        bundle_path_b, binary_path_b,
        ctypes.cast(features_arr, _vp)
    )

    if not instance:
        _dbg('suil_instance_new a retourné NULL')
        print(json.dumps({'error': 'suil_error',
                          'message': f'suil_instance_new a échoué (suil_ui_supported={supported}, binary={binary_path_str})'}), flush=True)
        _S.suil_host_free(host)
        _L.lilv_world_free(world)
        return

    _dbg('suil instance créée')
    widget_ptr = _S.suil_instance_get_widget(instance)
    _dbg(f'widget_ptr={widget_ptr}')

    # ── Fenêtre GTK3 ─────────────────────────────────────────────────────
    window = _G3.gtk_window_new(0)   # GTK_WINDOW_TOPLEVEL
    _G3.gtk_window_set_title(window, plugin_name.encode())
    _G3.gtk_window_set_default_size(window, 400, 300)
    _G3.gtk_container_add(window, widget_ptr)
    _G3.gtk_widget_show_all(window)
    _dbg('fenêtre GTK3 affichée')

    # ── Signal destroy ────────────────────────────────────────────────────
    stop = [False]
    DestroyCb = ctypes.CFUNCTYPE(None, ctypes.c_void_p, ctypes.c_void_p)

    def on_destroy(w, d):
        _dbg('destroy signal reçu')
        stop[0] = True

    destroy_cb = DestroyCb(on_destroy)
    _GO.g_signal_connect_data(window, b'destroy', destroy_cb, None, None, 0)

    # ── Valeurs initiales (après quelques itérations pour réaliser le widget) ──
    for _ in range(8):
        _GL.g_main_context_iteration(None, ctypes.c_bool(False))
    for sym, value in initial.items():
        idx = sym_to_idx.get(sym)
        if idx is not None:
            v = (_f32 * 1)(float(value))
            _S.suil_instance_port_event(instance, idx, 4, 0, ctypes.cast(v, _vp))

    print(json.dumps({'ready': True}), flush=True)
    _dbg('prêt, boucle principale')

    # ── Boucle principale ─────────────────────────────────────────────────
    while not stop[0]:
        _GL.g_main_context_iteration(None, ctypes.c_bool(False))
        time.sleep(0.005)

    # ── Nettoyage ─────────────────────────────────────────────────────────
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
        sys.stderr.write('Usage: lv2_ui.py <uri> [initial_json]\n')
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
