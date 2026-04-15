#!/usr/bin/env bash
# build-audio-server.sh — Compile audio_server.py en binaire autonome via PyInstaller
#
# Usage (depuis la racine du projet) :
#   bash scripts/build-audio-server.sh
#
# Résultat :
#   resources/bin/linux/audio_server   (Linux)
#   resources/bin/mac/audio_server     (macOS)
#
# Prérequis :
#   pip install pyinstaller sounddevice soundfile numpy pyrubberband websockets

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$SCRIPT_DIR/.."
cd "$ROOT"

# Détecter la plateforme
case "$(uname -s)" in
  Linux*)  OS=linux ;;
  Darwin*) OS=mac   ;;
  *)       echo "❌ Plateforme non supportée : $(uname -s)"; exit 1 ;;
esac

echo "▶ Build audio_server pour $OS..."

# Vérifier que PyInstaller est disponible
if ! python3 -m PyInstaller --version &>/dev/null; then
  echo "❌ PyInstaller non trouvé. Installez-le :"
  echo "   pip install pyinstaller"
  exit 1
fi

# Vérifier les dépendances Python
for pkg in sounddevice soundfile numpy pyrubberband websockets; do
  if ! python3 -c "import $pkg" &>/dev/null; then
    echo "⚠️  Dépendance manquante : $pkg"
    echo "   pip install $pkg"
    exit 1
  fi
done

# Nettoyer les builds précédents
rm -rf build/ dist/ __pycache__/

# Build PyInstaller (--onefile → un seul binaire autonome)
python3 -m PyInstaller audio_server.spec

# Copier le binaire dans resources/bin/<os>/
DEST="resources/bin/$OS"
mkdir -p "$DEST"
cp "dist/audio_server" "$DEST/audio_server"
chmod +x "$DEST/audio_server"

echo ""
echo "✅ Binaire créé : $DEST/audio_server"
echo "   Taille : $(du -sh "$DEST/audio_server" | cut -f1)"
echo ""
echo "Pour vérifier :"
echo "   $DEST/audio_server"
