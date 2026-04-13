-- importHoaAllRA.lua
-- Import partition_ambiX.wav (HOA) dans Reaper + IEM AllRADecoder configuré
-- avec le layout KandiskyScore (positions converti en az/el par l'application).
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

local ambiXPath   = lines[1] or ""
local hoaOrder    = tonumber(lines[2]) or 7
local sampleRate  = tonumber(lines[3]) or 48000
local layoutName  = lines[4] or "layout"
local nSpeakers   = tonumber(lines[5]) or 0

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
reaper.ShowConsoleMsg("=== Import HOA AmbiX → AllRADecoder ===\n")
reaper.ShowConsoleMsg("Fichier  : " .. ambiXPath .. "\n")
reaper.ShowConsoleMsg("Layout   : " .. layoutName .. " (" .. nSpeakers .. " HP)\n")
reaper.ShowConsoleMsg("Ordre HOA: " .. hoaOrder .. " (" .. nHoaCh .. " canaux)\n")

-- ── Piste HOA (64ch en entrée) ─────────────────────────────────
local numTracks = reaper.GetNumTracks()
reaper.InsertTrackAtIndex(numTracks, true)
local hoaTrack = reaper.GetTrack(0, numTracks)
reaper.GetSetMediaTrackInfo_String(hoaTrack, "P_NAME", "HOA AmbiX " .. nHoaCh .. "ch", true)
reaper.SetMediaTrackInfo_Value(hoaTrack, "I_NCHAN", nHoaCh)

-- ── Import du fichier ──────────────────────────────────────────
local item   = reaper.AddMediaItemToTrack(hoaTrack)
local take   = reaper.AddTakeToMediaItem(item)
local source = reaper.PCM_Source_CreateFromFile(ambiXPath)
if not source then
  reaper.ShowMessageBox("Impossible de charger :\n" .. ambiXPath, "Erreur", 0)
  reaper.Undo_EndBlock("Import HOA AllRA", -1)
  return
end
local length = reaper.GetMediaSourceLength(source)
reaper.SetMediaItemTake_Source(take, source)
reaper.SetMediaItemInfo_Value(item, "D_POSITION", 0.0)
reaper.SetMediaItemInfo_Value(item, "D_LENGTH", length)
reaper.ShowConsoleMsg("Item importé, durée : " .. string.format("%.2f", length) .. " s\n")

-- ── Ajout IEM AllRADecoder ─────────────────────────────────────
local fxIdx = reaper.TrackFX_AddByName(hoaTrack, "AllRADecoder", false, 1)
if fxIdx < 0 then
  fxIdx = reaper.TrackFX_AddByName(hoaTrack, "VST: AllRADecoder", false, 1)
end
if fxIdx < 0 then
  reaper.ShowMessageBox(
    "IEM AllRADecoder introuvable.\nVérifiez :\n  Options > Préférences > VST\n" ..
    "  Dossier : /usr/lib/x86_64-linux-gnu/iem-plugin-suite/vst/",
    "Plugin manquant", 0)
  reaper.Undo_EndBlock("Import HOA AllRA", -1)
  return
end
reaper.ShowConsoleMsg("AllRADecoder ajouté (index FX : " .. fxIdx .. ")\n")

-- inputOrderSetting = 0 (automatique)
reaper.TrackFX_SetParam(hoaTrack, fxIdx, 0, 0.0)
-- useSN3D = 1
reaper.TrackFX_SetParam(hoaTrack, fxIdx, 1, 1.0)

-- ── Construire l'état XML AllRADecoder ────────────────────────
-- Format JUCE ValueTree d'AllRADecoder (attributs requis : Azimuth Elevation
-- Radius Gain Channel IsImaginary)
local xmlParts = {}
table.insert(xmlParts, '<?xml version="1.0" encoding="UTF-8"?>')
table.insert(xmlParts, '<AllRADecoder inputOrderSetting="0" useSN3D="1" exportDecoder="1">')
for i, sp in ipairs(speakers) do
  table.insert(xmlParts, string.format(
    '  <Loudspeaker Azimuth="%s" Elevation="%s" Radius="%s" Gain="1.0" Channel="%d" IsImaginary="0"/>',
    sp.az, sp.el, sp.r, i))
end
table.insert(xmlParts, '</AllRADecoder>')
local xmlState = table.concat(xmlParts, '\n')

-- ── Base64 encode ─────────────────────────────────────────────
local b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
local function base64enc(data)
  return ((data:gsub('.', function(x)
    local r, b64 = '', x:byte()
    for i = 8, 1, -1 do r = r .. (b64 % 2^i - b64 % 2^(i-1) > 0 and '1' or '0') end
    return r
  end)..'0000'):gsub('%d%d%d?%d?%d?%d?', function(x)
    if #x < 6 then return '' end
    local c = 0
    for i = 1, 6 do c = c + (x:sub(i,i) == '1' and 2^(6-i) or 0) end
    return b64chars:sub(c+1, c+1)
  end)..({ '', '==', '=' })[#data % 3 + 1])
end

local encoded = base64enc(xmlState)

-- ── Appliquer l'état au plugin ─────────────────────────────────
local ok = reaper.TrackFX_SetNamedConfigParm(hoaTrack, fxIdx, "vst_chunk", encoded)
if ok then
  reaper.ShowConsoleMsg("État AllRADecoder appliqué (" .. nSpeakers .. " HP)\n")
else
  -- Fallback : écrire le fichier XML pour chargement manuel
  local xmlFile = reaper.GetResourcePath() .. "/kandiskyscore_allra_state.xml"
  local f = io.open(xmlFile, "w")
  if f then
    f:write(xmlState)
    f:close()
    local jsonFile = reaper.GetResourcePath() .. "/allra_layout.json"
    reaper.ShowConsoleMsg("⚠ vst_chunk non appliqué. XML sauvegardé :\n  " .. xmlFile .. "\n")
    reaper.ShowMessageBox(
      "L'état du plugin n'a pas pu être appliqué automatiquement.\n\n" ..
      "Option 1 – charger le JSON dans AllRADecoder (bouton Load) :\n" .. jsonFile ..
      "\n\nOption 2 – charger le XML :\n" .. xmlFile,
      "Configuration manuelle requise", 0)
  end
end

-- ── Piste de sortie (nSpeakers canaux) ────────────────────────
-- La piste HOA a déjà I_NCHAN = nHoaCh ; AllRADecoder sortira nSpeakers canaux
-- sur les premières sorties de la piste.
reaper.SetMediaTrackInfo_Value(hoaTrack, "I_NCHAN", math.max(nHoaCh, nSpeakers))

-- ── Finalisation ───────────────────────────────────────────────
reaper.UpdateArrange()
reaper.Undo_EndBlock("Import HOA AmbiX AllRADecoder", -1)
reaper.ShowConsoleMsg("✅ Import terminé.\n")
reaper.Main_OnCommand(40044, 0)
