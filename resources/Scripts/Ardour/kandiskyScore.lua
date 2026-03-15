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
		
		for iline=5, countLines,1 do
			 local items = {}
		 	 -- Splitting lines
		 	 for item in string.gmatch(lines[iline], "[^,]+") do
		   		 table.insert(items, item)
		 	 end
		  	local files = C.StringVector();
		 	files:push_back(directory .. items[3])

			local pos = 48000*items[5]
			Editor:do_import (files,
			Editing.ImportDistinctFiles, Editing.ImportAsTrack, ARDOUR.SrcQuality.SrcBest,
			ARDOUR.MidiTrackNameSource.SMFTrackName, ARDOUR.MidiTempoMapDisposition.SMFTempoIgnore,
			pos, ARDOUR.PluginInfo())

			local track_list = Session:get_routes ():table()

			local track = track_list[#track_list]
		 	pi = track:presentation_info_ptr ()
		  	pi:set_color ("0x" .. items[2])

		  	track:set_name(items[1])
		  	
		  	local proc = ARDOUR.LuaAPI.new_plugin (Session, "LV2ConvolutionStereo", ARDOUR.PluginType.LV2, "");
			assert (not proc:isnil())

		 	track:add_processor_by_index(proc, 0, nil, true)
		 	
		 /*
		 	local proc = ARDOUR.LuaAPI.new_plugin (Session, "objMatrixDominium", ARDOUR.PluginType.LV2, "");
			assert (not proc:isnil())

		 	track:add_processor_by_index(proc, 0, nil, true)

			ARDOUR.LuaAPI.set_processor_param (proc, 0, tonumber(items[25]))
			ARDOUR.LuaAPI.set_processor_param (proc, 1, tonumber(items[26]))
			ARDOUR.LuaAPI.set_processor_param (proc, 2, tonumber(items[27]))
			ARDOUR.LuaAPI.set_processor_param (proc, 4, 1)
			ARDOUR.LuaAPI.set_processor_param (proc, 6, 1)
			ARDOUR.LuaAPI.set_processor_param (proc, 10, 1)
			ARDOUR.LuaAPI.set_processor_param (proc, 14,1)
			ARDOUR.LuaAPI.set_processor_param (proc, 19, tonumber(items[28]))
			track:panner_shell():set_bypassed (true)
		*/  
		end
	end
end end
