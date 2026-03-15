---- this header is (only) required to save the script
-- ardour { ["type"] = "Snippet", name = "" }
-- function factory () return function () -- -- end end
---- this header is (only) required to save the script

ardour {
	["type"]    = "Snippet",
	name        = "KandiskyScore",
	license     = "GPL",
	author      = "Dominique Blanchemain",
	description = [[Import des objets de KandiskyScore]]
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


	local dialog_options = {

		{ type = "file", key = "file", title = "Select a File",  path = ARDOUR.LuaAPI.build_filename (Session:path (), Session:name () .. ".ardour") },

	}

	local od = LuaDialog.Dialog ("title", dialog_options)
	local rv = od:run()
	if (rv) then
		print (serialize ("dialog", rv))
		print(nfile)
		file, err = io.open(nfile, "r")
		
		lines = {}
		local countLines=0
		-- Read the file line by line and add each line to the table
		
		for line in file:lines() do
		  table.insert(lines, line)
		  countLines = countLines+1
		end
		
		-- Close the file
		
		io.close(file)

		local directory = lines[1]
		local plugin3D = lines[2]
		local pluginCn = lines[3]

		for iline=7, countLines,1 do
			 local items = {}
		 	 -- Splitting lines
		 	 for item in string.gmatch(lines[iline], "[^;]+") do
		   		 table.insert(items, item)
		 	 end
		 	 print(items[3])
			local files = C.StringVector();
			files:push_back(lines[1] .. items[3])
			
			local pos = Temporal.timepos_t(items[5])
			local track_list = Session:get_routes ():table()
			local track = track_list[#track_list]:to_track()
			
			-- local selCount = Editor:get_selection().tracks:routelist():size()
			local r = Session:route_by_selected_count(0)
			local ntrack = r:to_track()
			-- local tpos = r:presentation_info_ptr():order()
		
			local newTrack = Session:new_audio_track (2, 2, nil, 1, items[1], ARDOUR.PresentationInfo.max_order, ARDOUR.TrackMode.Normal, true)

			local vtrack = 	newTrack:front():to_track()
			
			Editor:do_import (files, Editing.ImportDistinctFiles, Editing.ImportAsRegion, ARDOUR.SrcQuality.SrcBest,
			ARDOUR.MidiTrackNameSource.SMFTrackName, ARDOUR.MidiTempoMapDisposition.SMFTempoIgnore,pos, ARDOUR.PluginInfo(),vtrack)
			
			local rname = {}
			for nregion in string.gmatch(items[3], "[^.]+") do
		   		 table.insert(rname, nregion)
		 	 end
			print (rname[1])
		 	 print(items[3])
			local nplaylist = newTrack:front():playlist()
			local rl = ARDOUR.RegionFactory.regions()
			for _, r in rl:iter() do
				-- only look for "sources", which are represented by "whole file regions"
			    -- and filter by audio-regions
				 if r:whole_file() and not r:to_audioregion():isnil() then
			      print (r:name())
			      -- add region to the track's playlist
				if(r:name()==rname[1]) then
			      		nplaylist:add_region (r, pos, 1, false)
			      		pos = pos + r:length ()
				end
			    end
			 end			

			-- track_list = Session:get_routes ():table()
			-- track = track_list[iline-6]:to_track()
			-- track:set_name(items[1])
			-- print (items[1])
			local pi = newTrack:front():presentation_info_ptr ()
			pi:set_color ("0x" .. items[2])
		 	
			-- local proc = ARDOUR.LuaAPI.new_plugin (Session, "Rate shifter", ARDOUR.PluginType.LV2, "")
			-- assert (not proc:isnil())
		 	-- track:add_processor_by_index(proc, 1, nil, true)
-- print(items[7])
			-- ARDOUR.LuaAPI.set_processor_param (proc, 0, tonumber(items[7]))

			-- local proc = ARDOUR.LuaAPI.new_plugin (Session, "MDA Detune", ARDOUR.PluginType.LV2, "")
			-- assert (not proc:isnil())

		 	-- track:add_processor_by_index(proc, 2, nil, true)

			-- local proc = ARDOUR.LuaAPI.new_plugin (Session, "LV2 Convolution Stereo", ARDOUR.PluginType.LV2, "")
			-- local proc = ARDOUR.LuaAPI.new_plugin (Session, "objMatrixDominium", ARDOUR.PluginType.LV2, "")
			-- assert (not proc:isnil())

		 	-- track:add_processor_by_index(proc, 1, nil, true)
			
		 end
		

	end
end end