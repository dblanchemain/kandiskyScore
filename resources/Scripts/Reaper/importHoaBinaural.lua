-- importHoaBinaural.lua
-- Import partition_ambiX.wav (HOA 64ch) dans Reaper + IEM BinauralDecoder
-- D.Blanchemain / Claude – Licence GPL2
-- Paramètres lus depuis autoInsert_hoa.txt :
--   ligne 1 : chemin complet de partition_ambiX.wav
--   ligne 2 : ordre HOA (ex. 7)
--   ligne 3 : fréquence d'échantillonnage (ex. 48000)

local configPath = reaper.GetResourcePath() .. "/kandiskyscore_hoa.txt"

-- Lecture du fichier de config généré par l'application
local file, err = io.open(configPath, "r")
if not file then
  reaper.ShowMessageBox(
    "Fichier de configuration introuvable :\n" .. configPath ..
    "\n\nLancez d'abord l'export HOA depuis KandiskyScore.",
    "Erreur", 0)
  return
end

local lines = {}
for line in file:lines() do
  table.insert(lines, line)
end
io.close(file)

local ambiXPath  = lines[1] or ""
local hoaOrder   = tonumber(lines[2]) or 7
local sampleRate = tonumber(lines[3]) or 48000
local nHoaCh     = (hoaOrder + 1) * (hoaOrder + 1)  -- 64 pour ordre 7

if ambiXPath == "" then
  reaper.ShowMessageBox("Chemin du fichier AmbiX manquant dans la configuration.", "Erreur", 0)
  return
end

-- Vérifier que le fichier existe
local f = io.open(ambiXPath, "r")
if not f then
  reaper.ShowMessageBox("Fichier introuvable :\n" .. ambiXPath, "Erreur", 0)
  return
end
io.close(f)

reaper.Undo_BeginBlock()
reaper.ClearConsole()
reaper.ShowConsoleMsg("=== Import HOA AmbiX Binaural ===\n")
reaper.ShowConsoleMsg("Fichier : " .. ambiXPath .. "\n")
reaper.ShowConsoleMsg("Ordre HOA : " .. hoaOrder .. " (" .. nHoaCh .. " canaux)\n")

-- ── Création de la piste HOA ───────────────────────────────────
local numTracks = reaper.GetNumTracks()
reaper.InsertTrackAtIndex(numTracks, true)
local track = reaper.GetTrack(0, numTracks)

reaper.GetSetMediaTrackInfo_String(track, "P_NAME", "HOA AmbiX " .. nHoaCh .. "ch", true)
reaper.SetMediaTrackInfo_Value(track, "I_NCHAN", nHoaCh)

-- ── Import du fichier à la position 0 ─────────────────────────
local item   = reaper.AddMediaItemToTrack(track)
local take   = reaper.AddTakeToMediaItem(item)
local source = reaper.PCM_Source_CreateFromFile(ambiXPath)

if not source then
  reaper.ShowMessageBox("Impossible de charger le fichier audio.\n" .. ambiXPath, "Erreur", 0)
  reaper.Undo_EndBlock("Import HOA AmbiX", -1)
  return
end

local length, isQN = reaper.GetMediaSourceLength(source)
reaper.SetMediaItemTake_Source(take, source)
reaper.SetMediaItemInfo_Value(item, "D_POSITION", 0.0)
reaper.SetMediaItemInfo_Value(item, "D_LENGTH", length)
reaper.ShowConsoleMsg("Item importé, durée : " .. string.format("%.2f", length) .. " s\n")

-- ── Ajout IEM BinauralDecoder ──────────────────────────────────
-- Reaper identifie le plugin par son nom tel qu'enregistré (JUCE VST2)
local fxIdx = reaper.TrackFX_AddByName(track, "BinauralDecoder", false, 1)

if fxIdx < 0 then
  -- Essai avec préfixe VST
  fxIdx = reaper.TrackFX_AddByName(track, "VST: BinauralDecoder", false, 1)
end

if fxIdx < 0 then
  reaper.ShowConsoleMsg("⚠ BinauralDecoder introuvable – vérifiez que IEM Plugin Suite est scanné.\n")
  reaper.ShowMessageBox(
    "Le plugin IEM BinauralDecoder n'a pas été trouvé.\n\n" ..
    "Vérifiez :\n  Options > Préférences > VST\n  et scannez :\n  " ..
    "  /usr/lib/x86_64-linux-gnu/iem-plugin-suite/vst/",
    "Plugin manquant", 0)
else
  reaper.ShowConsoleMsg("BinauralDecoder ajouté (index FX : " .. fxIdx .. ")\n")

  -- Paramètre 0 : inputOrderSetting
  -- 0.0 = automatique (détecte l'ordre HOA depuis le nombre de canaux reçus)
  -- Pour forcer l'ordre 7 explicitement : valeur normalisée = 8/8 = 1.0
  -- (0=auto, 1=0th, 2=1st, …, 8=7th order dans IEM BinauralDecoder)
  local orderParam = 0.0  -- automatique
  reaper.TrackFX_SetParam(track, fxIdx, 0, orderParam)
  reaper.ShowConsoleMsg("inputOrderSetting : automatique (0.0)\n")

  -- Paramètre 1 : applyHeadphoneEq (0=off par défaut)
  reaper.TrackFX_SetParam(track, fxIdx, 1, 0.0)
end

-- ── Finalisation ───────────────────────────────────────────────
reaper.UpdateArrange()
reaper.Undo_EndBlock("Import HOA AmbiX Binaural IEM", -1)

reaper.ShowConsoleMsg("✅ Import terminé.\n")
reaper.Main_OnCommand(40044, 0)  -- Zoom to fit project
