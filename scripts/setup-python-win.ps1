# setup-python-win.ps1
# Télécharge et configure Python Embeddable pour kandiskyScore (Windows)
# À exécuter une seule fois avant le build, depuis la racine du projet :
#   powershell -ExecutionPolicy Bypass -File scripts\setup-python-win.ps1

$ErrorActionPreference = "Stop"

$PY_VERSION  = "3.11.9"
$PY_ZIP_URL  = "https://www.python.org/ftp/python/$PY_VERSION/python-$PY_VERSION-embed-amd64.zip"
$DEST        = Join-Path $PSScriptRoot "..\resources\bin\win\python"
$GET_PIP_URL = "https://bootstrap.pypa.io/get-pip.py"
$PACKAGES    = @("sounddevice", "soundfile", "numpy", "websockets", "pyrubberband")

# ── 1. Créer le dossier de destination ───────────────────────────────────────
if (Test-Path $DEST) {
    Write-Host "⚠️  $DEST existe déjà. Suppression..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $DEST
}
New-Item -ItemType Directory -Path $DEST | Out-Null
Write-Host "📁 Dossier créé : $DEST"

# ── 2. Télécharger Python embeddable ─────────────────────────────────────────
$zipPath = Join-Path $env:TEMP "python-embed.zip"
Write-Host "⬇️  Téléchargement Python $PY_VERSION embeddable..."
Invoke-WebRequest -Uri $PY_ZIP_URL -OutFile $zipPath -UseBasicParsing
Write-Host "📦 Extraction..."
Expand-Archive -Path $zipPath -DestinationPath $DEST -Force
Remove-Item $zipPath

# ── 3. Activer site-packages dans le fichier ._pth ───────────────────────────
# Par défaut, Python embeddable ignore site-packages (pip ne fonctionne pas).
# Il faut décommenter "import site" dans python311._pth
$pthFile = Get-ChildItem -Path $DEST -Filter "python*._pth" | Select-Object -First 1
if ($null -eq $pthFile) {
    Write-Error "❌ Fichier ._pth introuvable dans $DEST"
    exit 1
}
Write-Host "✏️  Activation site-packages dans $($pthFile.Name)..."
$pthContent = Get-Content $pthFile.FullName -Raw
$pthContent = $pthContent -replace "#import site", "import site"
Set-Content -Path $pthFile.FullName -Value $pthContent -NoNewline

# ── 4. Installer pip ─────────────────────────────────────────────────────────
$getPipPath = Join-Path $env:TEMP "get-pip.py"
Write-Host "⬇️  Téléchargement get-pip.py..."
Invoke-WebRequest -Uri $GET_PIP_URL -OutFile $getPipPath -UseBasicParsing
$pythonExe = Join-Path $DEST "python.exe"
Write-Host "📦 Installation de pip..."
& $pythonExe $getPipPath --no-warn-script-location
Remove-Item $getPipPath

# ── 5. Installer les dépendances audio ───────────────────────────────────────
$pipExe = Join-Path $DEST "Scripts\pip.exe"
if (-not (Test-Path $pipExe)) {
    # Fallback : pip comme module
    $pipExe = $null
}

Write-Host "📦 Installation des dépendances : $($PACKAGES -join ', ')..."
foreach ($pkg in $PACKAGES) {
    Write-Host "  → $pkg"
    if ($pipExe) {
        & $pipExe install $pkg --no-warn-script-location
    } else {
        & $pythonExe -m pip install $pkg --no-warn-script-location
    }
}

# ── 6. Vérification ──────────────────────────────────────────────────────────
Write-Host "`n✅ Vérification des imports..."
$check = @"
import sounddevice, soundfile, numpy, websockets
print("sounddevice", sounddevice.__version__)
print("soundfile", soundfile.__version__)
print("numpy", numpy.__version__)
print("websockets OK")
try:
    import pyrubberband
    print("pyrubberband OK")
except ImportError as e:
    print("pyrubberband MANQUANT (optionnel) :", e)
"@
& $pythonExe -c $check

Write-Host "`n🎉 Python embeddable prêt dans : $DEST" -ForegroundColor Green
Write-Host "   Taille : $([math]::Round((Get-ChildItem $DEST -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB, 1)) Mo"
