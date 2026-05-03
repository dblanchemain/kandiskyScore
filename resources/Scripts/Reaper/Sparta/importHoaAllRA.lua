-- importHoaAllRA.lua (Sparta)
-- Import partition_ambiX.wav (HOA) dans Reaper + Sparta ambiDEC configuré
-- avec le layout KandiskyScore (positions converties en az/el par l'application).
-- D.Blanchemain / Claude – Licence GPL2
--
-- Format kandiskyscore_allra.txt :
--   ligne 1 : chemin complet partition_ambiX.wav
--   ligne 2 : ordre HOA (ex. 7)
--   ligne 3 : fréquence d'échantillonnage (ex. 48000)
--   ligne 4 : nom du layout (ex. anneau8)
--   ligne 5 : nombre de haut-parleurs
--   lignes 6+ : az,el,radius pour chaque HP (un par ligne)

local configPath = reaper.GetResourcePath() .. "/kandiskyscore_allra.txt"

local file, err = io.open(configPath, "r")
if not file then
  reaper.ShowMessageBox(
    "Fichier de configuration introuvable :\n" .. configPath ..
    "\n\nLancez l'export depuis KandiskyScore (menu HOA).",
    "Erreur", 0)
  return
end

local lines = {}
for line in file:lines() do table.insert(lines, line) end
io.close(file)

local ambiXPath  = lines[1] or ""
local hoaOrder   = tonumber(lines[2]) or 7
local sampleRate = tonumber(lines[3]) or 48000
local layoutName = lines[4] or "layout"
local nSpeakers  = tonumber(lines[5]) or 0

if ambiXPath == "" or nSpeakers == 0 then
  reaper.ShowMessageBox("Configuration incomplète.", "Erreur", 0)
  return
end

-- Lire les positions az,el,radius (garder les chaînes brutes pour éviter
-- le reformatage par string.format qui utilise la locale système)
local speakers = {}
for i = 1, nSpeakers do
  local ln = lines[5 + i] or "0,0,1"
  local az, el, r = ln:match("([^,]+),([^,]+),([^,]+)")
  table.insert(speakers, { az = az or "0", el = el or "0", r = r or "1" })
end

local nHoaCh = (hoaOrder + 1) * (hoaOrder + 1)

reaper.Undo_BeginBlock()
reaper.ClearConsole()
reaper.ShowConsoleMsg("=== Import HOA AmbiX → Sparta ambiDEC ===\n")
reaper.ShowConsoleMsg("Fichier  : " .. ambiXPath .. "\n")
reaper.ShowConsoleMsg("Layout   : " .. layoutName .. " (" .. nSpeakers .. " HP)\n")
reaper.ShowConsoleMsg("Ordre HOA: " .. hoaOrder .. " (" .. nHoaCh .. " canaux)\n")

-- ── Piste HOA ─────────────────────────────────────────────────
local numTracks = reaper.GetNumTracks()
reaper.InsertTrackAtIndex(numTracks, true)
local hoaTrack = reaper.GetTrack(0, numTracks)
reaper.GetSetMediaTrackInfo_String(hoaTrack, "P_NAME", "HOA AmbiX " .. nHoaCh .. "ch", true)
reaper.SetMediaTrackInfo_Value(hoaTrack, "I_NCHAN", math.max(nHoaCh, nSpeakers))

-- ── Import du fichier ──────────────────────────────────────────
local item   = reaper.AddMediaItemToTrack(hoaTrack)
local take   = reaper.AddTakeToMediaItem(item)
local source = reaper.PCM_Source_CreateFromFile(ambiXPath)
if not source then
  reaper.ShowMessageBox("Impossible de charger :\n" .. ambiXPath, "Erreur", 0)
  reaper.Undo_EndBlock("Import HOA AllRA Sparta", -1)
  return
end
local length = reaper.GetMediaSourceLength(source)
reaper.SetMediaItemTake_Source(take, source)
reaper.SetMediaItemInfo_Value(item, "D_POSITION", 0.0)
reaper.SetMediaItemInfo_Value(item, "D_LENGTH", length)
reaper.ShowConsoleMsg("Item importé, durée : " .. string.format("%.2f", length) .. " s\n")

-- ── Ajout Sparta ambiDEC ───────────────────────────────────────
local fxIdx = reaper.TrackFX_AddByName(hoaTrack, "sparta_ambiDEC", false, 1)
if fxIdx < 0 then
  fxIdx = reaper.TrackFX_AddByName(hoaTrack, "VST: sparta_ambiDEC", false, 1)
end
if fxIdx < 0 then
  fxIdx = reaper.TrackFX_AddByName(hoaTrack, "ambiDEC", false, 1)
end
if fxIdx < 0 then
  reaper.ShowMessageBox(
    "Sparta ambiDEC introuvable.\nVérifiez :\n  Options > Préférences > VST\n" ..
    "  Dossier : /usr/lib/vst/ (ou chemin d'installation Sparta)",
    "Plugin manquant", 0)
  reaper.Undo_EndBlock("Import HOA AllRA Sparta", -1)
  return
end
reaper.ShowConsoleMsg("sparta_ambiDEC ajouté (index FX : " .. fxIdx .. ")\n")

-- Paramètre 0 : masterOrder (0.0 = auto, détecte depuis le nombre de canaux)
reaper.TrackFX_SetParam(hoaTrack, fxIdx, 0, 0.0)
-- Paramètre 1 : decMethod (0 = SAD – max energy, 1 = MMD, 2 = EPAD, 3 = ALLRAD)
-- ALLRAD (3) est le plus proche de l'approche AllRADecoder IEM
reaper.TrackFX_SetParam(hoaTrack, fxIdx, 1, 3.0 / 3.0)  -- ALLRAD normalisé

-- ── Générer le fichier de layout Sparta ambiDEC ───────────────
-- Format JSON attendu par Sparta ambiDEC (preset loudspeakers)
local exportDir = ambiXPath:match("^(.*)[/\\][^/\\]*$") or reaper.GetResourcePath()
local jsonFile  = exportDir .. "/sparta_ambiDEC_layout.json"

local jsonLines = {}
table.insert(jsonLines, '{')
table.insert(jsonLines, '  "num_ls": ' .. nSpeakers .. ',')
table.insert(jsonLines, '  "ls_dirs_deg": [')
for i, sp in ipairs(speakers) do
  local sep = (i < nSpeakers) and "," or ""
  table.insert(jsonLines, "    [" .. sp.az .. ", " .. sp.el .. "]" .. sep)
end
table.insert(jsonLines, '  ]')
table.insert(jsonLines, '}')

local jf = io.open(jsonFile, "w")
if jf then
  jf:write(table.concat(jsonLines, "\n"))
  jf:close()
  reaper.ShowConsoleMsg("Layout JSON Sparta : " .. jsonFile .. "\n")
else
  reaper.ShowConsoleMsg("⚠ Impossible d'écrire le fichier JSON.\n")
end

-- ── Message de configuration manuelle ─────────────────────────
reaper.ShowMessageBox(
  "Sparta ambiDEC ajouté.\n\n" ..
  "Chargez le layout des enceintes dans le plugin :\n\n" ..
  "  1. Double-cliquez sur ambiDEC dans la chaîne FX\n" ..
  "  2. Bouton « Load » → sélectionner :\n" ..
  "     " .. jsonFile .. "\n\n" ..
  "  Layout : " .. layoutName .. " (" .. nSpeakers .. " HP)",
  "Configuration ambiDEC", 0)

-- ── Finalisation ───────────────────────────────────────────────
reaper.UpdateArrange()
reaper.Undo_EndBlock("Import HOA AmbiX Sparta ambiDEC", -1)
reaper.ShowConsoleMsg("✅ Import terminé.\n")
reaper.Main_OnCommand(40044, 0)
