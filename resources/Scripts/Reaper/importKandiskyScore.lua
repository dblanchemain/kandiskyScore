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

-- Set parameters

local directory = lines[1]
local plugin3D = lines[2]
local pluginCn = lines[3]

local config = {}
  for conf in string.gmatch(lines[4], "[^,]+") do
    table.insert(config, conf)
  end

-- Definition of the pitch amplitude

reaper.SNM_SetIntConfigVar("pitchenvrange", 12);

-- Reading each line

for iline=5, countLines,1 do

  local items = {}
  -- Splitting lines
  for item in string.gmatch(lines[iline], "[^,]+") do
    table.insert(items, item)
  end

  -- Get the path to the media file
  
  local mediaFilePath = directory ..  items[3]
  
  -- Insert the media file onto the track at the start of the project
  
  -- reaper.InsertMedia(mediaFilePath,0+512+(tonumber(items[4])<<16))
  reaper.InsertMedia(mediaFilePath,1)
  local track = reaper.GetTrack(0,iline-5)
  local retval = reaper.SetMediaTrackInfo_Value(track,"B_MAINSEND" ,1)
  local retval = reaper.SetMediaTrackInfo_Value(track,"I_NCHAN" ,tonumber(pluginCn))
  
  count_items = reaper.CountMediaItems(0);
  local nitem = reaper.GetMediaItem(0,count_items-1)
  
  -- Defining audio settings
  
  local baselength=reaper.GetMediaItemInfo_Value(nitem, "D_LENGTH")
  
  reaper.SetMediaItemInfo_Value(nitem,"D_POSITION",tonumber(items[5]))
  reaper.SetMediaItemInfo_Value(nitem,"D_VOL",tonumber(items[6]))
  local active_take = reaper.GetActiveTake(nitem)
  if config[2]==1 then
   reaper.SetMediaItemTakeInfo_Value(active_take,"D_PLAYRATE",tonumber(items[7]))
   reaper.SetMediaItemTakeInfo_Value(active_take,"D_PITCH",tonumber(items[8])/100)
  else
   reaper.SetMediaItemTakeInfo_Value(active_take,"D_PLAYRATE",1)
   reaper.SetMediaItemTakeInfo_Value(active_take,"D_PITCH",0)
  end
  reaper.SetMediaItemTakeInfo_Value(active_take,"D_STARTOFFS",tonumber(items[9])*baselength)
  reaper.GetSetMediaItemTakeInfo_String(active_take , "P_NAME",items[1],1,1)
  
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
  
  -- Calculation of the real duration according to the transposition and the value of detune
  
  local transpo = reaper.GetMediaItemTakeInfo_Value(active_take,"D_PLAYRATE")
  local nlength=baselength/transpo
  nlength=nlength*tonumber(items[10])
  reaper.SetMediaItemInfo_Value(nitem, "D_LENGTH", nlength)
  length=reaper.GetMediaItemInfo_Value(nitem, "D_LENGTH")
  
  local nbtake=reaper.GetMediaItemNumTakes(nitem)
  
  -- Creating an envelope of volume for the active take
  if tonumber(config[1])==1 then
  env = reaper.GetTakeEnvelopeByName(active_take, "Volume")
  if env == nil then
    reaper.Main_OnCommand(40693,0)
    env = reaper.GetTakeEnvelopeByName(active_take, "Volume")
  end
  
  -- Adjusted envelope parameters for Reaper
  
  local lg=baselength
  
  reaper.InsertEnvelopePoint(env, 0,items[18]*850-125.5, 0, 0,false, true)
  reaper.InsertEnvelopePoint(env, tonumber(items[12])*lg,tonumber(items[19])*850-125.5, 0, 0,false, true)
  reaper.InsertEnvelopePoint(env, tonumber(items[13])*lg,tonumber(items[20])*850-125.5, 0, 0,false, true)
  reaper.InsertEnvelopePoint(env, tonumber(items[14])*lg,tonumber(items[21])*850-125.5, 0, 0,false, true)
  reaper.InsertEnvelopePoint(env, tonumber(items[15])*lg,tonumber(items[22])*850-125.5, 0, 0,false, true)
  reaper.InsertEnvelopePoint(env, tonumber(items[16])*lg,tonumber(items[23])*850-125.5, 0, 0,false, true)
  reaper.InsertEnvelopePoint(env, lg,tonumber(items[24])*850-125.5, 0, 0,false, true)
  reaper.Envelope_SortPoints(env)
  
  end
  -- Plugin settings

  action = {
    ["1"] = function (x)
            local fxpos = reaper.TakeFX_AddByName(active_take, "faustBandPass", 1)
            reaper.ShowConsoleMsg("ctparam " .. ctparam .. "\n")
            reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 2, tonumber(items[ctparam]))
            end,
    ["2"] = function (x) 
            local fxpos = reaper.TakeFX_AddByName(active_take, "faustOberheimBPF", 1)
            reaper.TakeFX_SetParam(active_take, fxpos, 0, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
            end,
    ["3"] = function (x) 
            local fxpos = reaper.TakeFX_AddByName(active_take, "faustOberheimBSF", 1)
            reaper.TakeFX_SetParam(active_take, fxpos, 0, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
            end,
    ["4"] = function (x) 
            local fxpos = reaper.TakeFX_AddByName(active_take, "faustChorus", 1)
            reaper.TakeFX_SetParam(active_take, fxpos, 0, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 2, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 3, tonumber(items[ctparam]))
            end,
    ["5"] = function (x) 
            local fxpos = reaper.TakeFX_AddByName(active_take, "faustCombFilter", 1)
            reaper.TakeFX_SetParam(active_take, fxpos, 0, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
            end,
    ["6"] = function (x) 
            local fxpos = reaper.TakeFX_AddByName(active_take, "faustCrybaby", 1)
            reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
            end,
    ["7"] = function (x) 
            local fxpos = reaper.TakeFX_AddByName(active_take, "faustDelay", 1)
            reaper.TakeFX_SetParam(active_take, fxpos, 0, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 2, tonumber(items[ctparam]))
            end,
    ["8"] = function (x) 
            local fxpos = reaper.TakeFX_AddByName(active_take, "distortionFaust", 1)
            reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 2, tonumber(items[ctparam]))
            end,
    ["9"] = function (x) 
            local fxpos = reaper.TakeFX_AddByName(active_take, "flangerFaust", 1)
            reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 2, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 3, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 4, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 5, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 6, tonumber(items[ctparam]))
            end,
    ["10"] = function (x) 
             local fxpos = reaper.TakeFX_AddByName(active_take, "faustFreeverb", 1)
             reaper.TakeFX_SetParam(active_take, fxpos, 0, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 2, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 3, tonumber(items[ctparam]))
            end,
    ["11"] = function (x) 
             reaper.TakeFX_AddByName(active_take, "faustGranulator", 1)
             reaper.TakeFX_SetParam(active_take, fxpos, 0, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 2, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 3, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 4, tonumber(items[ctparam]))
            end,
    ["12"] = function (x) 
             reaper.TakeFX_AddByName(active_take, "faustModulation", 1)
             reaper.TakeFX_SetParam(active_take, fxpos, 0, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 2, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 3, tonumber(items[ctparam]))
             ctparam=ctparam+1
            end,
    ["13"] = function (x) 
             reaper.TakeFX_AddByName(active_take, "faustMoogLadder", 1)
             reaper.TakeFX_SetParam(active_take, fxpos, 0, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
             ctparam=ctparam+1
            end,
    ["14"] = function (x) 
             local fxpos = reaper.TakeFX_AddByName(active_take, "moogVcfFaust", 1)
             reaper.TakeFX_SetParam(active_take, fxpos, 0, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 2, tonumber(items[ctparam]))
            end,
    ["15"] = function (x) 
             local fxpos = reaper.TakeFX_AddByName(active_take, "faustNoiseGate", 1)
             reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 2, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 3, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 4, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 5, tonumber(items[ctparam]))
            end,
    ["16"] = function (x) 
             local fxpos = reaper.TakeFX_AddByName(active_take, "faustPeakEQ", 1)
             reaper.TakeFX_SetParam(active_take, fxpos, 0, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 2, tonumber(items[ctparam]))
            end,
    ["17"] = function (x) 
             local fxpos = reaper.TakeFX_AddByName(active_take, "faustPhaser", 1) 
             reaper.TakeFX_SetParam(active_take, fxpos, 2, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 3, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 4, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 5, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 6, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 7, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 8, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 9, tonumber(items[ctparam]))
            end,
    ["18"] = function (x) 
             local fxpos = reaper.TakeFX_AddByName(active_take, "faustRingModulator", 1)
             reaper.TakeFX_SetParam(active_take, fxpos, 0, tonumber(items[ctparam]))
             ctparam=ctparam+1
             reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
            end,
    ["19"] = function (x) 
            local fxpos = reaper.TakeFX_AddByName(active_take, "faustTremolo", 1)
            reaper.TakeFX_SetParam(active_take, fxpos, 1, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 2, tonumber(items[ctparam]))
            ctparam=ctparam+1
            reaper.TakeFX_SetParam(active_take, fxpos, 3, tonumber(items[ctparam]))
            end,
    
  }
  local drand=0;
  ctparam=39
  if tonumber(config[3])==1 then
  for i = 32, 38, 1 do
   
    if(items[i]~="0")then
      action[items[i]](ctparam)
      ctparam=ctparam+1
      drand=drand+1
    end
  end
  end
  -- Definition of the spatialization plugin 3D
  
  reaper.TakeFX_AddByName(active_take, plugin3D, 1)
  reaper.TakeFX_SetParam(active_take, drand, 0, tonumber(items[25])) -- X
  reaper.TakeFX_SetParam(active_take, drand, 1, tonumber(items[26])) -- Y
  reaper.TakeFX_SetParam(active_take, drand, 2, tonumber(items[27])) -- Z
  reaper.TakeFX_SetParam(active_take, drand, 4,1)
  reaper.TakeFX_SetParam(active_take, drand, 6,1)
  reaper.TakeFX_SetParam(active_take, drand, 10,1)
  reaper.TakeFX_SetParam(active_take, drand, 14,1)
  reaper.TakeFX_SetParam(active_take, drand, 19, tonumber(items[28])) -- D
  
  -- Definition of the Volume envelope
  if tonumber(config[1])==1 then
  local env = reaper.GetTakeEnvelopeByName(active_take, "Volume")
  if env ~= nil then
    local retval, env_chunk = reaper.GetEnvelopeStateChunk(env, "", false)
    env_chunk = env_chunk:gsub("VIS 0", "VIS 1")
    reaper.SetEnvelopeStateChunk(env, env_chunk, false)
    env_chunk = env_chunk:gsub("ACT 0 ", "ACT 1 ")
    reaper.SetEnvelopeStateChunk(env, env_chunk, false)
  else
    reaper.ShowMessageBox("Erreur : l'enveloppe de volume n'existe pas pour le take "..tostring(i), "Erreur", 0)
  end
  end
  -- Definition of the Pitch envelope 
  if tonumber(config[2])==1 then
  if tonumber(items[30])>0 then
    local env = reaper.GetTakeEnvelopeByName(active_take, "Pitch")
    if env == nil then
      reaper.Main_OnCommand(reaper.NamedCommandLookup("_S&M_TAKEENV10"),0)
       env = reaper.GetTakeEnvelopeByName(active_take, "Pitch")
    end
     
     if env ~= nil then
       local retval, env_chunk = reaper.GetEnvelopeStateChunk(env, "", false)
     else
       reaper.ShowMessageBox("Erreur : l'enveloppe de Pitch n'existe pas pour le take "..tostring(i), "Erreur", 0)
     end
     reaper.InsertEnvelopePoint(env, 0, tonumber(items[29]), 0, 0,false, true)
     reaper.InsertEnvelopePoint(env, tonumber(items[30]), tonumber(items[31]), 0, 0,false, true)
   end
   end
end

-- Make all volume envelopes visible
 if tonumber(config[1])==1 then
count_items2 = reaper.CountMediaItems(0)
for i=1,count_items2 do
  local selectedItem = reaper.GetMediaItem(0,i-1)
  -- Récupérer le premier take de l'item
  local take = reaper.GetMediaItemTake(selectedItem, 0)
  local env = reaper.GetTakeEnvelopeByName(take, "Volume")
  if env ~= nil then
    local retval, env_chunk = reaper.GetEnvelopeStateChunk(env, "", false)
    env_chunk = env_chunk:gsub("VIS 0", "VIS 1")
    reaper.SetEnvelopeStateChunk(env, env_chunk, false)
    env_chunk = env_chunk:gsub("ACT 0 ", "ACT 1 ")
    reaper.SetEnvelopeStateChunk(env, env_chunk, false)
  else
    reaper.ShowMessageBox("Erreur : l'enveloppe de volume n'existe pas pour le take "..tostring(i), "Erreur", 0)
  end
end
end
 
 
