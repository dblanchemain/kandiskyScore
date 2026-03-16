ardour {
  ["type"]    = "EditorAction",
  name        = "insertKs3b",
  author      = "Blanchemain",
  description = "Session-load callback example",
}

function factory () return function ()
	
	md = nil
	collectgarbage ()

	-----------------------------------------------------------------
	function basic_serialize (o)
		if type(o) == "number" then
			return tostring(o)
		else
			return string.format("%q", o)
		end
	end
	local nfile=""
	function serialize (name, value)
		local rv = name .. ' = '
		collectgarbage()
		if type(value) == "number" or type(value) == "string" or type(value) == "nil" or type (value) == "boolean" then
			return rv .. basic_serialize(value) .. ' '
		elseif type(value) == "table" then
			rv = rv .. '{} '
			for k,v in pairs(value) do
				local fieldname = string.format("%s[%s]", name, basic_serialize(k))
				nfile=v
				rv = rv .. serialize(fieldname, v) .. ' '
			end
			return rv
		elseif type(value) == "function" then
			--return rv .. string.format("%q", string.dump(value, true))
			return rv .. "(function)"
		else
			error('cannot serialize a ' .. type(value))
		end
	end
	-----------------------------------------------------------------

	-- local dialog_options = {

		-- { type = "file", key = "file", title = "Select a File",  path = ARDOUR.LuaAPI.build_filename (Session:path (), Session:name () .. ".ardour") },

	-- }

	-- local od = LuaDialog.Dialog ("title", dialog_options)
	-- local rv = od:run()
	-- if (rv) then
		-- print (serialize ("dialog", rv))
		-- print(nfile)
		-- file, err = io.open(nfile, "r")
	-- end	
	local filepath = (os.getenv("HOME") or os.getenv("USERPROFILE")) .. "/kandiskyscore/Projets/autoInsert.txt"
	local file, err = io.open(filepath, "r")
	if not file then
		print("Erreur ouverture fichier : " .. (err or filepath))
		return
	end
	local lines = {}
	for line in file:lines() do
	  table.insert(lines, line)
	end
	print(#lines)
	io.close(file)

	local directory = lines[1]
	local plugin3D = lines[2]
	local pluginCn = lines[3]
	local sampleRate = lines[4]
	local gainPoints = lines[5]


	local playhead = Temporal.timepos_t (Session:transport_sample ())

	-- Calculer offsetpos depuis la première ligne de données
	local firstItems = {}
	for item in string.gmatch(lines[6], "[^;]+") do table.insert(firstItems, item) end
	local offsetpos = tonumber(firstItems[5]) or 0




-- ************************************************************************************


    -- Récupérer le master bus
    local master = Session:master_out()

   -- 🔹 Récupérer le contrôle de gain
   local gain_control = master:gain_control()

    -- Liste d’automation
    local alist = gain_control:alist()
    alist:clear(Temporal.timepos_t(0), Temporal.timepos_t(1e9))
    print(" Points d’automation effacés.")
    local sr = Session:nominal_sample_rate()

    Session:begin_reversible_command("Automation Volume Master")

    for pair in string.gmatch(gainPoints, "([^;]+)") do
      local t, g = pair:match("([^,]+),([^,]+)")
      local time_sec = tonumber(t)
      local mult = tonumber(g)
      if time_sec and mult then
        -- Conversion du facteur → dB → coefficient interne
        local db = 20 * math.log(mult, 10)
        local coeff = ARDOUR.DSP.dB_to_coefficient(db)
        local sample_pos = math.floor(time_sec * sr)
        local timepos = Temporal.timepos_t(sample_pos)

        alist:add(timepos, coeff)
        print(string.format("→ t=%.1fs (%.0f samples) | mult=%.2f | %.2fdB | coeff=%.6f",
              time_sec, sample_pos, mult, db, coeff))
      else
        print(" Erreur de parsing :", pair)
      end
    end

    Session:commit_reversible_command(nil)
    print(" Automation du volume master mise à jour.")


-- ***********************************************************************************

	
	for iline=6, #lines,1 do
	 	 -- Splitting lines
		local items = {}
		for item in string.gmatch(lines[iline], "[^;]+") do
			
	   		table.insert(items, item)
		end
		print(items[1])
		local trackNum = items[4]:gsub("[%s\r\n]", "")
		local track_list = Session:get_routes ():table()
		local lsize=#track_list-1
		print(lsize)
		local track=""
		if tonumber(trackNum)>lsize then
			local newTrack = Session:new_audio_track (2, 2, nil, 1,"track" .. trackNum, ARDOUR.PresentationInfo.max_order, ARDOUR.TrackMode.Normal, true)

			local pi = newTrack:front():presentation_info_ptr ()
			pi:set_color ("0x" .. items[2])

			local proc = ARDOUR.LuaAPI.new_plugin (Session, plugin3D, ARDOUR.PluginType.LV2, "")
			assert (not proc:isnil())
			newTrack:front():add_processor_by_index(proc,4, nil, true)
			newTrack:front():panner_shell():set_bypassed (true)
		end
		local r = Session:route_by_name("track" .. trackNum)
		track = r:to_track()

		local files = C.StringVector();
		local nfile = directory .. "/exports/" .. items[3] .. ".wav"
		local pos = Temporal.timepos_t(0)
		files:push_back(nfile)
		Editor:do_import (files, Editing.ImportDistinctFiles, Editing.ImportAsRegion, ARDOUR.SrcQuality.SrcBest, ARDOUR.MidiTrackNameSource.SMFTrackName, ARDOUR.MidiTempoMapDisposition.SMFTempoIgnore,pos, ARDOUR.PluginInfo(),track, false)

		local rname = {}
		for nregion in string.gmatch(items[3], "[^.]+") do
		   table.insert(rname, nregion)
		 end
		local pos = playhead + Temporal.timepos_t(tonumber(items[5]) - offsetpos)
		local nplaylist = track:playlist()
		local rl = ARDOUR.RegionFactory.regions()

		local al, cl, pd = ARDOUR.LuaAPI.plugin_automation (r:nth_plugin (0), 0)
		local al1, cl1, pd1 = ARDOUR.LuaAPI.plugin_automation (r:nth_plugin (0), 1)
		local al2, cl2, pd2 = ARDOUR.LuaAPI.plugin_automation (r:nth_plugin (0), 2)		
		local al3, cl3, pd3 = ARDOUR.LuaAPI.plugin_automation (r:nth_plugin (0), 4)
		for _, nr in rl:iter() do
			-- only look for "sources", which are represented by "whole file regions"
		   -- and filter by audio-regions
			if nr:whole_file() and not nr:to_audioregion():isnil() then
		      		print (nr:name())
		      		-- add region to the track's playlist
				if(nr:name()==rname[1]) then
		      			nplaylist:add_region (nr, pos, 1, false)
		      			-- pos = pos + r:length ()
					local ar = nr:to_audioregion ()
					local rd = ar:to_readable ()

					local rparam = {}
					for param in string.gmatch(items[6], "[^,]+") do
		   				table.insert(rparam, param)
		 			end
					table.insert(rparam, 1)
					local rparamx = {}
					for paramx in string.gmatch(items[7], "[^,]+") do
		   				table.insert(rparamx, paramx)
		 			end
					table.insert(rparamx, rparamx[#rparamx])
					local rparamy = {}
					for paramy in string.gmatch(items[8], "[^,]+") do
		   				table.insert(rparamy, paramy)
		 			end
					table.insert(rparamy, rparamy[#rparamy])
					local rparamz = {}
					for paramz in string.gmatch(items[9], "[^,]+") do
		   				table.insert(rparamz, paramz)
		 			end
					table.insert(rparamz, rparamz[#rparamz])
					local rparamd = {}
					for paramd in string.gmatch(items[10], "[^,]+") do
		   			table.insert(rparamd, paramd)
		 			end
					table.insert(rparamd, rparamd[#rparamd])
					for i=1,#rparam do
						--  local pos=math.floor(dt[i]*3.7)*48000
						local tpos = Temporal.timepos_t (math.floor(rparam[i]*rd:readable_length ()))
						cl:add (pos+ tpos,rparamx[i],true, true)
						cl1:add (pos + tpos,rparamy[i],true, true)
						cl2:add (pos + tpos,rparamz[i],true, true)
						cl3:add (pos + tpos,rparamd[i],true, true)
					end
				end
		   end
		 end	
		
		
	 end
	local playhead_is_at = Session:transport_sample ()
   Session:request_locate (playhead_is_at, false, ARDOUR.LocateTransportDisposition.MustRoll, ARDOUR.TransportRequestSource.TRS_UI)


end end
