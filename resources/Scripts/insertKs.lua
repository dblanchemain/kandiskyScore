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
	end	
	lines = {}
	-- Read the file line by line and add each line to the table
	
	for line in file:lines() do
	  table.insert(lines, line)
	end
	print(#lines)
	-- Close the file
	
	io.close(file)

	local directory = lines[1]
	local plugin3D = lines[2]
	local pluginCn = lines[3]

	local playhead = Temporal.timepos_t (Session:transport_sample ())
	
	for iline=4, #lines,1 do
	 	 -- Splitting lines
		local items = {}
		for item in string.gmatch(lines[iline], "[^;]+") do
			
	   		table.insert(items, item)
		end
		print(items[1])
		local track_list = Session:get_routes ():table()
		local lsize=#track_list-1
		print(lsize)
		local track=""
		if tonumber(items[4])>lsize then		
			local newTrack = Session:new_audio_track (2, 2, nil, 1,"track" .. iline-3, ARDOUR.PresentationInfo.max_order, ARDOUR.TrackMode.Normal, true)
						
			local pi = newTrack:front():presentation_info_ptr ()
			pi:set_color ("0x" .. items[2])

			local proc = ARDOUR.LuaAPI.new_plugin (Session, plugin3D, ARDOUR.PluginType.LV2, "")
			assert (not proc:isnil())
			newTrack:front():add_processor_by_index(proc,4, nil, true)
			newTrack:front():panner_shell():set_bypassed (true)		
		end
		local r = Session:route_by_name("track" .. items[4])
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
		if iline==4 then
			offsetpos=items[5]
			pos=  Temporal.timepos_t (Session:transport_sample ())
			print(math.floor(tonumber(items[5])/48000),items[5])
		else
			pos = Temporal.timepos_t(math.floor(items[5]+Session:transport_sample ()-offsetpos))
		end
		local pos = playhead+Temporal.timepos_t(items[5]-offsetpos)
		local nplaylist = track:playlist()
		local rl = ARDOUR.RegionFactory.regions()

		local al, cl, pd = ARDOUR.LuaAPI.plugin_automation (r:nth_plugin (0), 0)
		local al1, cl1, pd1 = ARDOUR.LuaAPI.plugin_automation (r:nth_plugin (0), 1)
		local al2, cl2, pd2 = ARDOUR.LuaAPI.plugin_automation (r:nth_plugin (0), 2)		
		local al3, cl3, pd3 = ARDOUR.LuaAPI.plugin_automation (r:nth_plugin (0), 19)
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

end end