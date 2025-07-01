-- https://forums.cockos.com/showthread.php?t=231661
-- https://forums.cockos.com/showthread.php?t=231661

function print(val)
    reaper.ShowConsoleMsg(tostring(val)..'\n')
end

function recive_midi_osc()
    --print('running')
    local is_new_value,_,_,_,_,_,val = reaper.get_action_context()
    if is_new_value == true then
        print('is_new_value:      '..tostring(is_new_value))
        print('val:      '..tostring(val))
    end
    reaper.defer(recive_midi_osc)
end

function fim()
    print('fim')
end

print('started')
recive_midi_osc()
reaper.atexit(fim)