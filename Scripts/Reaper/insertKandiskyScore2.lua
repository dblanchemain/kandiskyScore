--Script import Kandiskyscore objects
-- D.Blanchemain
-- Licence GPL2 (GNU)


retval, filepath = reaper.GetUserFileNameForRead("", "Select a file", "")

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

-- Set parameters

local directory = lines[1]
local plugin3D = lines[2]
local pluginCn = lines[3]

local config = {}
  for conf in string.gmatch(lines[4], "[^,]+") do
    table.insert(config, conf)
  end

-- Definition of the pitch amplitude


-- Reading each line
local playhead = reaper.GetCursorPositionEx(0)

reaper.ShowMessageBox("playhead " .. playhead ,"info",0)
for iline=4, #lines,1 do

  local items = {}
  -- Splitting lines
  for item in string.gmatch(lines[iline], "[^;]+") do
    table.insert(items, item)
  end

  local numtracks = reaper.GetNumTracks()
  
  local ltrack=tonumber(items[4])
  if ltrack>numtracks then
  		 reaper.InsertTrackAtIndex(numtracks+1, true)
  		 reaper.TrackFX_AddByName(reaper.GetTrack(0, tonumber(items[4])-1),lines[2],false,1)
  		 reaper.ShowMessageBox("nbtrack2 " .. numtracks ,"info",0)
  end
  local track = reaper.GetTrack(0, tonumber(items[4])-1) -- track 1  
  local mediaFilePath = directory .. "exports/" .. items[3] .. ".wav"
  
  if  iline==4 then
  		offsetpos=items[5]/48000
  end
  
  local pos=playhead + (tonumber(items[5])/48000)-offsetpos
  local nitem=addItemToTrack(track, mediaFilePath, pos)

  local active_take = reaper.GetActiveTake(nitem)
 
  reaper.GetSetMediaItemTakeInfo_String(active_take , "P_NAME",items[1],1,1)
  local source=reaper.GetMediaItemTake_Source(active_take)
  local retval, lengthIsQN = reaper.GetMediaSourceLength(source )
  reaper.ShowMessageBox("length " .. retval ,"info",0)

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
  local envd = reaper.GetFXEnvelope(track,0,19,true)
  for ifx=1, #spacet,1 do
  	reaper.InsertEnvelopePoint(envx,pos+(tonumber(spacet[ifx]*retval)),(1+tonumber(spacex[ifx]))/2, 0, 0, false, true)
  	reaper.InsertEnvelopePoint(envy,pos+(tonumber(spacet[ifx]*retval)),(1+tonumber(spacey[ifx]))/2, 0, 0, false, true)
  	reaper.InsertEnvelopePoint(envz,pos+(tonumber(spacet[ifx]*retval)),(1+tonumber(spacez[ifx]))/2, 0, 0, false, true)
  	reaper.InsertEnvelopePoint(envd,pos+(tonumber(spacet[ifx]*retval)),(1+tonumber(spaced[ifx]))/2, 0, 0, false, true)
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
 
 
