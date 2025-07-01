---- this header is (only) required to save the script
-- ardour { ["type"] = "Snippet", name = "" }
-- function factory () return function () -- -- end end
---- this header is (only) required to save the script
-- ardour { ["type"] = "Snippet", name = "" }
-- function factory () return function () -- -- end end
ardour { ["type"] = "Snippet", name = "Fader Automation" }

function factory () return function ()
	local playhead = Temporal.timepos_t (Session:transport_sample ())
	local samplerate = Temporal.timecnt_t (Session:nominal_sample_rate ())
	print(Session:transport_sample ()/48000)
	print(Session:nominal_sample_rate ())
	-- get selected tracks
	rl = Editor:get_selection ().tracks:routelist ()

	-- prepare undo operation
	Session:begin_reversible_command ("Fancy Fade Out")
	local add_undo = false -- keep track if something has changed

	-- iterate over selected tracks
	for r in rl:iter () do
		local ac = r:amp ():gain_control () -- ARDOUR:AutomationControl
		local al = ac:alist () -- ARDOUR:AutomationList (state, high-level)

		-- set automation state to "Touch"
		ac:set_automation_state (ARDOUR.AutoState.Touch)

		-- query the value at the playhead position
		local g = al:eval (playhead)

		print (g)
		print(g * (1 - math.sqrt (2 / 50)))

		print (r:n_inputs():n_audio())
		print(r:n_outputs():n_audio())
		print(r:muted())
		print(r:peak_meter ())

		for r in Session:get_tracks():iter() do
			print ("*", r:name())
			for p in Session:playlists():playlists_for_track (r:to_track()):iter() do
				if (p == r:to_track():playlist()) then
					print (" >-", p:name(), p:n_regions())
					for k in p:region_list():iter() do
						if(k:position()> Temporal.timepos_t (192887)) then
							print(m, k:position())
							print (k:position():samples())
							print (k:length():samples()/48000)
							k:set_length(Temporal.timecnt_t (6.0*48000))
							print (k:length():samples()/48000)
							print (k:start():samples()/48000)
						end
						
					end
				else
					print ("  -", p:name(), p:n_regions())
				end
			end
		end
		

		-- get state for undo
		local before = al:get_state ()

		-- delete all events after the playhead...
		al:truncate_end (playhead)

		-- ...and generate some new ones.
		for i=0,50 do
			-- use a sqrt fade-out (the shape is recognizable, and otherwise
			-- not be possible to achieve with existing ardour fade shapes)
			al:add (playhead + samplerate:scale (Temporal.ratio (i, 50)),
			        g * (1 - math.sqrt (i / 50)),
			        false, true)
		end

		-- remove dense events
		al:thin (20)

		-- save undo
		local after = al:get_state ()
		Session:add_command (al:memento_command (before, after))
		add_undo = true

		::out::
	end

	-- all done, commit the combined Undo Operation
	if add_undo then
		-- the 'nil' Command here means to use the collected diffs added above
		Session:commit_reversible_command (nil)
	else
		Session:abort_reversible_command ()
	end
end end