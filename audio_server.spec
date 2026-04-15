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
from PyInstaller.utils.hooks import collect_all, collect_dynamic_libs

datas      = []
binaries   = []
hiddenimports = []

# Collecter tous les fichiers (données + bibliothèques natives + imports cachés)
# pour chaque dépendance majeure
for pkg in ['sounddevice', 'soundfile', 'numpy', 'pyrubberband', 'websockets']:
    d, b, h = collect_all(pkg)
    datas      += d
    binaries   += b
    hiddenimports += h

# Imports cachés supplémentaires
hiddenimports += [
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
