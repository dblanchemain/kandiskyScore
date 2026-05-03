-- importHoaBinaural.lua (Sparta)
-- Import partition_ambiX.wav (HOA) dans Reaper + Sparta ambiBIN
-- D.Blanchemain / Claude – Licence GPL2
--
-- Format kandiskyscore_hoa.txt :
--   ligne 1 : chemin complet partition_ambiX.wav
--   ligne 2 : ordre HOA (ex. 7)
--   ligne 3 : fréquence d'échantillonnage (ex. 48000)

local configPath = reaper.GetResourcePath() .. "/kandiskyscore_hoa.txt"

local file, err = io.open(configPath, "r")
if not file then
  reaper.ShowMessageBox(
    "Fichier de configuration introuvable :\n" .. configPath ..
    "\n\nLancez d'abord l'export HOA depuis KandiskyScore.",
    "Erreur", 0)
  return
end

local lines = {}
for line in file:lines() do table.insert(lines, line) end
io.close(file)

local ambiXPath  = lines[1] or ""
local hoaOrder   = tonumber(lines[2]) or 7
local sampleRate = tonumber(lines[3]) or 48000
local nHoaCh     = (hoaOrder + 1) * (hoaOrder + 1)

if ambiXPath == "" then
  reaper.ShowMessageBox("Chemin du fichier AmbiX manquant dans la configuration.", "Erreur", 0)
  return
end

local f = io.open(ambiXPath, "r")
if not f then
  reaper.ShowMessageBox("Fichier introuvable :\n" .. ambiXPath, "Erreur", 0)
  return
end
io.close(f)

reaper.Undo_BeginBlock()
reaper.ClearConsole()
reaper.ShowConsoleMsg("=== Import HOA AmbiX – Sparta ambiBIN ===\n")
reaper.ShowConsoleMsg("Fichier   : " .. ambiXPath .. "\n")
reaper.ShowConsoleMsg("Ordre HOA : " .. hoaOrder .. " (" .. nHoaCh .. " canaux)\n")

-- ── Création de la piste HOA ───────────────────────────────────
local numTracks = reaper.GetNumTracks()
reaper.InsertTrackAtIndex(numTracks, true)
local track = reaper.GetTrack(0, numTracks)

reaper.GetSetMediaTrackInfo_String(track, "P_NAME", "HOA AmbiX " .. nHoaCh .. "ch", true)
reaper.SetMediaTrackInfo_Value(track, "I_NCHAN", nHoaCh)

-- ── Import du fichier ──────────────────────────────────────────
local item   = reaper.AddMediaItemToTrack(track)
local take   = reaper.AddTakeToMediaItem(item)
local source = reaper.PCM_Source_CreateFromFile(ambiXPath)

if not source then
  reaper.ShowMessageBox("Impossible de charger le fichier audio.\n" .. ambiXPath, "Erreur", 0)
  reaper.Undo_EndBlock("Import HOA AmbiX Sparta", -1)
  return
end

local length = reaper.GetMediaSourceLength(source)
reaper.SetMediaItemTake_Source(take, source)
reaper.SetMediaItemInfo_Value(item, "D_POSITION", 0.0)
reaper.SetMediaItemInfo_Value(item, "D_LENGTH", length)
reaper.ShowConsoleMsg("Item importé, durée : " .. string.format("%.2f", length) .. " s\n")

-- ── Ajout Sparta ambiBIN ───────────────────────────────────────
local fxIdx = reaper.TrackFX_AddByName(track, "sparta_ambiBIN", false, 1)
if fxIdx < 0 then
  fxIdx = reaper.TrackFX_AddByName(track, "VST: sparta_ambiBIN", false, 1)
end
if fxIdx < 0 then
  fxIdx = reaper.TrackFX_AddByName(track, "ambiBIN", false, 1)
end

if fxIdx < 0 then
  reaper.ShowConsoleMsg("⚠ sparta_ambiBIN introuvable – vérifiez que Sparta est scanné.\n")
  reaper.ShowMessageBox(
    "Le plugin Sparta ambiBIN n'a pas été trouvé.\n\n" ..
    "Vérifiez :\n  Options > Préférences > VST\n" ..
    "  et scannez le dossier d'installation Sparta.",
    "Plugin manquant", 0)
else
  reaper.ShowConsoleMsg("sparta_ambiBIN ajouté (index FX : " .. fxIdx .. ")\n")

  -- Paramètre 0 : masterOrder (0.0 = auto)
  reaper.TrackFX_SetParam(track, fxIdx, 0, 0.0)
  reaper.ShowConsoleMsg("masterOrder : automatique (0.0)\n")

  -- Paramètre 1 : useRoomIR (0 = désactivé, HRTF intégré par défaut)
  reaper.TrackFX_SetParam(track, fxIdx, 1, 0.0)

  -- Pour utiliser un fichier SOFA personnalisé : charger via le GUI du plugin
  -- (bouton « Load SOFA » dans ambiBIN)
  reaper.ShowConsoleMsg("HRTF : intégré par défaut. Pour SOFA : bouton Load SOFA dans le plugin.\n")
end

-- ── Finalisation ───────────────────────────────────────────────
reaper.UpdateArrange()
reaper.Undo_EndBlock("Import HOA AmbiX Sparta ambiBIN", -1)
reaper.ShowConsoleMsg("✅ Import terminé.\n")
reaper.Main_OnCommand(40044, 0)
