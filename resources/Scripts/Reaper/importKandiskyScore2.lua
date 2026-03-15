--Script import Kandiskyscore objects
-- D.Blanchemain
-- Licence GPL2 (GNU)
local script_dir = debug.getinfo(1, "S").source:match("@?(.+[/\\])")
local TARGET_PROJECT = script_dir .. "tmp.rpp"

local function wait_for_project()

  local proj, proj_fn = reaper.EnumProjects(-1, "")
  if not proj then
    reaper.defer(wait_for_project)
    return
  end

  -- attendre que le BON projet soit chargé
  if proj_fn ~= TARGET_PROJECT then
    reaper.defer(wait_for_project)
    return
  end

  -- attendre que les pistes soient prêtes
  if reaper.GetNumTracks() == 0 then
    reaper.defer(wait_for_project)
    return
  end

  -- ✅ TOUT EST PRÊT
  main()
end
function addItemToTrack(track, file, position)
  local item   = reaper.AddMediaItemToTrack(track)
  local take   = reaper.AddTakeToMediaItem(item)
  local source = reaper.PCM_Source_CreateFromFile(file)
  local length, isQN = reaper.GetMediaSourceLength(source)

  if isQN then
    local posQN = reaper.TimeMap2_timeToQN(nil, position)
    length = reaper.TimeMap2_QNToTime(nil, posQN + length) - position
  end

  reaper.SetMediaItemTake_Source(take, source)
  reaper.SetMediaItemInfo_Value(item, 'D_POSITION', position)
  reaper.SetMediaItemInfo_Value(item, 'D_LENGTH', length)
  reaper.UpdateArrange()
  return item
end
local function parse_number(v)
  if not v then return nil end
  v = tostring(v)
  -- ne garder que chiffres, signe, point
  v = v:gsub("[^%d%+%-%.]", "")
  return tonumber(v)
end
function main()
--retval, filepath = reaper.GetUserFileNameForRead("", "Select a file", "")
filepath=os.getenv("HOME") .. "/kandiskyscore/Projets/autoInsert.txt"
file, err = io.open(filepath, "r")
lines = {}
local countLines=0
-- Read the file line by line and add each line to the table

reaper.ClearConsole()
for line in file:lines() do
  table.insert(lines, line)
  countLines = countLines+1
end

-- Close the file

io.close(file)




-- Set parameters

local directory = lines[1]
local plugin3D = lines[2]
local pluginCn = lines[3]
local sampleRate = lines[4]
local gain = lines[5]
local gainPoints = {}
for pair in string.gmatch(gain, "([^;]+)") do
  local t, g = pair:match("([^,]+),([^,]+)")
  local time = tonumber(t)
  local gain = tonumber(g)
  if time and gain then
    table.insert(gainPoints, {time, gain})
  end
end



-- Affichage pour vérification
-- reaper.ShowConsoleMsg("tempoX: " .. table.concat(tempoX, ", ") .. "\n")
-- reaper.ShowConsoleMsg("tempoY: " .. table.concat(tempoY, ", ") .. "\n")
local playhead = reaper.GetCursorPositionEx(0)

-- Reading each line
-- *****************************************************************
reaper.ClearConsole()

-- 🔹 Récupérer la piste master
local master = reaper.GetMasterTrack(0)
if not master then
  reaper.ShowMessageBox("❌ Master introuvable", "Erreur", 0)
  return
end
reaper.ShowConsoleMsg("✅ Master trouvé\n")

-- 🔹 Récupérer / afficher l’enveloppe "Volume (Pre-FX)"
local env = reaper.GetTrackEnvelopeByName(master, "Volume (Pre-FX)")
if not env then
  reaper.Main_OnCommand(40406, 0) -- afficher master envelopes
  env = reaper.GetTrackEnvelopeByName(master, "Volume (Pre-FX)")
end
if not env then
  reaper.ShowMessageBox("❌ Impossible de trouver l'enveloppe 'Volume (Pre-FX)'.", "Erreur", 0)
  return
end
reaper.ShowConsoleMsg("✅ Enveloppe trouvée : Volume (Pre-FX)\n")

-- 🔹 Effacer tous les anciens points via le "chunk"
local retval, chunk = reaper.GetEnvelopeStateChunk(env, "", false)
if retval then
  local cleaned = chunk:gsub("<POINT.-\n", "")
  reaper.SetEnvelopeStateChunk(env, cleaned, false)
  reaper.ShowConsoleMsg("🧹 Points existants supprimés\n")
end

-- ✅ Important : forcer Reaper à rafraîchir l’enveloppe avant d’ajouter des points
reaper.Envelope_SortPoints(env)

-- 🔹 Ajouter les nouveaux points
for _, pt in ipairs(gainPoints) do
  local time, lin = pt[1], pt[2]
  if lin <= 0 then lin = 0.0001 end
  local db = 20 * math.log(lin, 10)
  local val = reaper.DB2SLIDER(db)
  reaper.ShowConsoleMsg(string.format("→ t=%.1fs, gain=%.2f (%.2fdB) -> raw=%.2f\n", time, lin, db, val))
  reaper.InsertEnvelopePoint(env, time, val, 0, 1, false, true)
end

-- 🔹 Finaliser
reaper.Envelope_SortPoints(env)
reaper.UpdateArrange()

reaper.ShowConsoleMsg("✅ Points ajoutés et triés.\n")

-- ******************************************************************
local numtracks = reaper.GetNumTracks()
-- reaper.ShowMessageBox("playhead " .. playhead ,"info",0)
for iline=6, #lines,1 do

  local items = {}
  -- Splitting lines
  for item in string.gmatch(lines[iline], "[^;]+") do
    table.insert(items, item)
  end

  
--local ltrack = tonumber(items[4])
local ltrack = parse_number(items[4])
if not ltrack then
	reaper.ShowConsoleMsg("items[4] invalide", "DEBUG")
  
  return
end
  --local ltrack=tonumber(items[4])
  if ltrack>numtracks then
       reaper.InsertTrackAtIndex(numtracks+1, true)
       reaper.TrackFX_AddByName(reaper.GetTrack(0, tonumber(items[4])-1),lines[2],false,1)
       reaper.SetMediaTrackInfo_Value(reaper.GetTrack(0, tonumber(items[4])-1), 'I_NCHAN', tonumber(lines[3]) )
      numtracks = numtracks +1
  end
  local track = reaper.GetTrack(0, tonumber(items[4])-1) -- track 1  
  local mediaFilePath = directory .. "exports/" .. items[3] .. ".wav"
  
  if  iline==6 then
      offsetpos=items[5]/sampleRate
  end
  
  local pos=playhead + (items[5]/sampleRate)-offsetpos
  local nitem=addItemToTrack(track, mediaFilePath, pos)

  local active_take = reaper.GetActiveTake(nitem)
 
  reaper.GetSetMediaItemTakeInfo_String(active_take , "P_NAME",items[1],1,1)
  local source=reaper.GetMediaItemTake_Source(active_take)
  local retval, lengthIsQN = reaper.GetMediaSourceLength(source )
  -- reaper.ShowMessageBox("length " .. retval ,"info",0)

  local spacet={}
  for paramt in string.gmatch(items[6], "[^,]+") do
    table.insert(spacet,paramt)
  end
  table.insert(spacet, 1)
  local spacex={}
  for paramx in string.gmatch(items[7], "[^,]+") do
    table.insert(spacex,paramx)
  end
  table.insert(spacex, spacex[#spacex])
  local spacey={}
  for paramy in string.gmatch(items[8], "[^,]+") do
    table.insert(spacey,paramy)
  end
  table.insert(spacey, spacey[#spacey])
  local spacez={}
  for paramz in string.gmatch(items[9], "[^,]+") do
    table.insert(spacez,paramz)
  end
  table.insert(spacez, spacez[#spacez])
  local spaced={}
  for paramd in string.gmatch(items[10], "[^,]+") do
    table.insert(spaced,paramd)
  end
  table.insert(spaced, spaced[#spaced])
  local envx = reaper.GetFXEnvelope(track,0,0,true)
  local envy = reaper.GetFXEnvelope(track,0,1,true)
  local envz = reaper.GetFXEnvelope(track,0,2,true)
  local envd = reaper.GetFXEnvelope(track,0,4,true)
  for ifx=1, #spacet,1 do
    reaper.InsertEnvelopePoint(envx,pos+(tonumber(spacet[ifx]*retval)),tonumber(spacex[ifx]), 0, 0, false, true)
    reaper.InsertEnvelopePoint(envy,pos+(tonumber(spacet[ifx]*retval)),tonumber(spacey[ifx]), 0, 0, false, true)
    reaper.InsertEnvelopePoint(envz,pos+(tonumber(spacet[ifx]*retval)),tonumber(spacez[ifx]), 0, 0, false, true)
    reaper.InsertEnvelopePoint(envd,pos+(tonumber(spacet[ifx]*retval)),tonumber(spaced[ifx]), 0, 0, false, true)
  end
  -- Definition of item color
  local cl=items[2]
  --cl =  cl:gsub("#","")
  local ccl1 = "0x"..cl:sub(1,2)
  local ccl2 = "0x"..cl:sub(3,4)
  local ccl3 = "0x"..cl:sub(5,6)
  
  ccl1=tonumber(ccl1)
  ccl2=tonumber(ccl2)
  ccl3=tonumber(ccl3)
  
  local color_int=(ccl3 + 256 * ccl2 + 65536 * ccl1)|16777216
  reaper.SetMediaItemTakeInfo_Value(active_take, "I_CUSTOMCOLOR", color_int)
  
   
end
end
reaper.defer(wait_for_project)