ardour {
  ["type"]    = "EditorAction",
  name        = "importKandiskyScore2",
  author      = "Blanchemain",
  description = "Import KandiskyScore objects into Ardour",
}

function factory () return function ()

  -- Lecture du fichier autoInsert.txt
  local function getAutoInsertPath()
    local appdata = os.getenv("APPDATA")
    if appdata then
      return appdata:gsub("\\", "/") .. "/kandiskyscore/autoInsert.txt"
    end
    local home = os.getenv("HOME") or ""
    local macLib = home .. "/Library/Application Support"
    local f = io.open(macLib, "r")
    if f then f:close()
      return macLib .. "/kandiskyscore/autoInsert.txt"
    end
    return (os.getenv("XDG_CONFIG_HOME") or (home .. "/.config")) .. "/kandiskyscore/autoInsert.txt"
  end
  local filepath = getAutoInsertPath()
  local file, err = io.open(filepath, "r")
  if not file then
    print("Erreur ouverture fichier : " .. (err or filepath))
    return
  end
  local lines = {}
  for line in file:lines() do
    table.insert(lines, line)
  end
  io.close(file)
  print(#lines .. " lignes lues")

  -- Paramètres globaux
  local directory  = lines[1]
  local plugin3D   = lines[2]
  local pluginCn   = lines[3]
  local sampleRate = tonumber(lines[4]) or 48000
  local gainStr    = lines[5]

  local sr       = Session:nominal_sample_rate()
  local playhead = Temporal.timepos_t(Session:transport_sample())

  -- Helper : nettoyer une valeur numérique (strip whitespace, \r, etc.)
  local function parse_number(v)
    if not v then return nil end
    v = tostring(v):gsub("[^%d%+%-%.]", "")
    return tonumber(v)
  end

  -- Offsetpos depuis la première ligne de données (en samples session)
  local firstItems = {}
  for item in string.gmatch(lines[6], "[^;]+") do table.insert(firstItems, item) end
  local offsetpos = math.floor((tonumber(firstItems[5]) or 0) / sampleRate * sr)

  -- *** Automation volume Master ***
  local master = Session:master_out()
  if not master then
    print("Erreur : master bus introuvable")
    return
  end
  local gain_control = master:gain_control()
  local alist = gain_control:alist()
  alist:clear(Temporal.timepos_t(0), Temporal.timepos_t(1e9))

  Session:begin_reversible_command("Automation Volume Master")
  for pair in string.gmatch(gainStr, "([^;]+)") do
    local t, g    = pair:match("([^,]+),([^,]+)")
    local time_sec = tonumber(t)
    local mult     = tonumber(g)
    if time_sec and mult then
      if mult <= 0 then mult = 0.0001 end
      local db    = 20 * math.log(mult, 10)
      local coeff = ARDOUR.DSP.dB_to_coefficient(db)
      local tpos  = Temporal.timepos_t(math.floor(time_sec * sr))
      alist:add(tpos, coeff)
      print(string.format("gain → t=%.1fs | %.2fdB | coeff=%.6f", time_sec, db, coeff))
    else
      print("Erreur parsing gain : " .. tostring(pair))
    end
  end
  Session:commit_reversible_command(nil)
  print("Automation volume master mise à jour.")

  -- *** Import des objets ***
  for iline = 6, #lines do
    local items = {}
    for item in string.gmatch(lines[iline], "[^;]+") do
      table.insert(items, item)
    end

    local trackNum = items[4]:gsub("[%s\r\n]", "")
    local ltrack   = parse_number(trackNum)
    if not ltrack then
      print("items[4] invalide ligne " .. iline)
      return
    end

    -- Créer la piste si nécessaire
    local track_list = Session:get_routes():table()
    local lsize = #track_list - 1
    if ltrack > lsize then
      local newTrack = Session:new_audio_track(2, 2, nil, 1, "track" .. trackNum,
        ARDOUR.PresentationInfo.max_order, ARDOUR.TrackMode.Normal, true)
      local pi = newTrack:front():presentation_info_ptr()
      pi:set_color("0x" .. items[2])
      local proc = ARDOUR.LuaAPI.new_plugin(Session, plugin3D, ARDOUR.PluginType.LV2, "")
      assert(not proc:isnil())
      newTrack:front():add_processor_by_index(proc, 4, nil, true)
      newTrack:front():panner_shell():set_bypassed(true)
    end

    local r = Session:route_by_name("track" .. trackNum)
    if not r or r:isnil() then
      print("Piste introuvable : track" .. trackNum)
      return
    end
    local track = r:to_track()

    -- Import du fichier audio
    local mediaFilePath = directory .. "exports/" .. items[3] .. ".wav"
    local importPos = Temporal.timepos_t(0)
    local files = C.StringVector()
    files:push_back(mediaFilePath)
    Editor:do_import(files, Editing.ImportDistinctFiles, Editing.ImportAsRegion,
      ARDOUR.SrcQuality.SrcBest, ARDOUR.MidiTrackNameSource.SMFTrackName,
      ARDOUR.MidiTempoMapDisposition.SMFTempoIgnore,
      importPos, ARDOUR.PluginInfo(), track, false)

    -- Position dans la session (conversion sampleRate fichier → SR session)
    local pos_samples = math.floor(tonumber(items[5]) / sampleRate * sr)
    local pos = playhead + Temporal.timepos_t(pos_samples - offsetpos)

    -- Placer la région sur la playlist
    local rname    = items[3]:match("([^.]+)")
    local nplaylist = track:playlist()
    local rl       = ARDOUR.RegionFactory.regions()

    local al,  cl,  pd  = ARDOUR.LuaAPI.plugin_automation(r:nth_plugin(0), 0)
    local al1, cl1, pd1 = ARDOUR.LuaAPI.plugin_automation(r:nth_plugin(0), 1)
    local al2, cl2, pd2 = ARDOUR.LuaAPI.plugin_automation(r:nth_plugin(0), 2)
    local al3, cl3, pd3 = ARDOUR.LuaAPI.plugin_automation(r:nth_plugin(0), 4)

    for _, nr in rl:iter() do
      if nr:whole_file() and not nr:to_audioregion():isnil() then
        if nr:name() == rname then
          nplaylist:add_region(nr, pos, 1, false)

          local ar   = nr:to_audioregion()
          local rd   = ar:to_readable()
          local rlen = rd:readable_length()

          -- Paramètres de spatialisation
          local spacet, spacex, spacey, spacez, spaced = {}, {}, {}, {}, {}
          for v in string.gmatch(items[6],  "[^,]+") do table.insert(spacet, tonumber(v)) end
          for v in string.gmatch(items[7],  "[^,]+") do table.insert(spacex, tonumber(v)) end
          for v in string.gmatch(items[8],  "[^,]+") do table.insert(spacey, tonumber(v)) end
          for v in string.gmatch(items[9],  "[^,]+") do table.insert(spacez, tonumber(v)) end
          for v in string.gmatch(items[10], "[^,]+") do table.insert(spaced, tonumber(v)) end
          table.insert(spacet, 1)
          table.insert(spacex, spacex[#spacex])
          table.insert(spacey, spacey[#spacey])
          table.insert(spacez, spacez[#spacez])
          table.insert(spaced, spaced[#spaced])

          for i = 1, #spacet do
            local tpos = Temporal.timepos_t(math.floor(spacet[i] * rlen))
            cl:add (pos + tpos, spacex[i], true, true)
            cl1:add(pos + tpos, spacey[i], true, true)
            cl2:add(pos + tpos, spacez[i], true, true)
            cl3:add(pos + tpos, spaced[i], true, true)
          end
        end
      end
    end

    print("Import : " .. items[1] .. " → track" .. trackNum)
  end

  -- Relancer la lecture depuis la position courante
  local playhead_is_at = Session:transport_sample()
  Session:request_locate(playhead_is_at, false,
    ARDOUR.LocateTransportDisposition.MustRoll,
    ARDOUR.TransportRequestSource.TRS_UI)

end end
