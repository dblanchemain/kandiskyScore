# audio_server.spec
# Spec PyInstaller pour audio_server.py (kandiskyScore)
#
# Usage :
#   pyinstaller audio_server.spec
#
# Produit :
#   dist/audio_server          (Linux / macOS)
#   dist/audio_server.exe      (Windows)
#
# Copier ensuite dans :
#   resources/bin/linux/audio_server
#   resources/bin/mac/audio_server
#   resources/bin/win/audio_server.exe

import sys
import os
from PyInstaller.utils.hooks import collect_all, collect_dynamic_libs, collect_data_files

datas      = []
binaries   = []
hiddenimports = []

# sounddevice et soundfile sont des modules simples (pas des packages),
# collect_all ne fonctionne pas — collecter leurs données compagnes explicitement.
# _sounddevice_data contient les binaires PortAudio.
# _soundfile_data contient libsndfile.
for companion in ['_sounddevice_data', '_soundfile_data']:
    try:
        d, b, h = collect_all(companion)
        datas      += d
        binaries   += b
        hiddenimports += h
    except Exception:
        pass

# Collecter sounddevice/soundfile en tant que modules simples
import sounddevice, soundfile
for mod, obj in [('sounddevice', sounddevice), ('soundfile', soundfile)]:
    mod_file = obj.__file__
    datas.append((mod_file, '.'))
    # Collecter les libs dynamiques dans le répertoire du module
    mod_dir = os.path.dirname(mod_file)
    for lib_dir in [mod_dir, os.path.join(mod_dir, '_sounddevice_data'),
                    os.path.join(mod_dir, '_soundfile_data')]:
        if os.path.isdir(lib_dir):
            datas.append((lib_dir, os.path.basename(lib_dir)))

# numpy, pyrubberband, websockets : packages normaux
for pkg in ['numpy', 'pyrubberband', 'websockets']:
    d, b, h = collect_all(pkg)
    datas      += d
    binaries   += b
    hiddenimports += h

# Imports cachés supplémentaires
hiddenimports += [
    'sounddevice',
    'soundfile',
    'asyncio',
    'websockets.server',
    'websockets.legacy',
    'websockets.legacy.server',
    'ctypes',
    'ctypes.util',
]

a = Analysis(
    ['audio_server.py'],
    pathex=[],
    binaries=binaries,
    datas=datas,
    hiddenimports=hiddenimports,
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'tkinter', 'matplotlib', 'PIL', 'cv2',
        'IPython', 'jupyter', 'notebook',
        'PyQt5', 'PyQt6', 'wx', 'gi',
    ],
    noarchive=False,
)

pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='audio_server',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,          # UPX peut casser certaines libs natives
    console=True,       # stdio nécessaire (stdout pour AUDIO_SERVER_READY)
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
