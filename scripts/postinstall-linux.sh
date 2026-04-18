#!/bin/bash
# Post-installation kandiskyScore : installe les dépendances audio Python
# Exécuté automatiquement par dpkg/rpm après installation du paquet.

set -e

pip3 install --user --quiet sounddevice soundfile numpy pyrubberband websockets 2>/dev/null || \
  echo "[kandiskyScore] pip3 indisponible — lancez manuellement : pip3 install sounddevice soundfile numpy pyrubberband websockets"
