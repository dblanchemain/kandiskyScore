ardour {
  ["type"]    = "EditorAction",
  name        = "HOA AmbiX – IEM AllRADecoder",
  author      = "D.Blanchemain / Claude",
  description = "Importe partition_ambiX.wav (HOA) et ajoute IEM AllRADecoder configuré avec le layout KandiskyScore. Config lue depuis ~/.config/kandiskyscore/kandiskyscore_allra.txt",
}

function factory () return function ()

  -- ── Lecture du fichier de config généré par KandiskyScore ─────
  local home       = os.getenv("HOME") or ""
  local configDir  = (os.getenv("XDG_CONFIG_HOME") or (home .. "/.config")) .. "/kandiskyscore"
  local configPath = configDir .. "/kandiskyscore_allra.txt"

  local file, err = io.open(configPath, "r")
  if not file then
    print("Erreur : fichier de config introuvable : " .. configPath)
    print("Lancez d'abord l'export AllRA depuis KandiskyScore (menu HOA).")
    return
  end

  local lines = {}
  for line in file:lines() do table.insert(lines, line) end
  io.close(file)

  local ambiXPath  = lines[1] or ""
  local hoaOrder   = tonumber(lines[2]) or 7
  local sampleRate = tonumber(lines[3]) or 48000
  local layoutName = lines[4] or "layout"
  local nSpeakers  = tonumber(lines[5]) or 0
  local nHoaCh     = (hoaOrder + 1) * (hoaOrder + 1)

  if ambiXPath == "" or nSpeakers == 0 then
    print("Erreur : configuration incomplète dans " .. configPath)
    return
  end

  -- Vérifier le fichier source
  local f = io.open(ambiXPath, "r")
  if not f then
    print("Erreur : fichier introuvable : " .. ambiXPath)
    return
  end
  io.close(f)

  -- Lire les positions az, el, radius
  local speakers = {}
  for i = 1, nSpeakers do
    local ln = lines[5 + i] or "0,0,1"
    local az, el, r = ln:match("([^,]+),([^,]+),([^,]+)")
    table.insert(speakers, {
      az = tonumber(az) or 0,
      el = tonumber(el) or 0,
      r  = tonumber(r)  or 1
    })
  end

  print("=== Import HOA AmbiX – IEM AllRADecoder ===")
  print("Fichier  : " .. ambiXPath)
  print("Layout   : " .. layoutName .. " (" .. nSpeakers .. " HP)")
  print("Ordre HOA: " .. hoaOrder .. " (" .. nHoaCh .. " canaux)")

  -- ── Création de la piste HOA ──────────────────────────────────
  local nOut      = math.max(nHoaCh, nSpeakers)
  local trackName = "HOA " .. layoutName .. " " .. nSpeakers .. "HP"
  local newTracks = Session:new_audio_track(nHoaCh, nSpeakers, nil, 1, trackName,
    ARDOUR.PresentationInfo.max_order, ARDOUR.TrackMode.Normal, true)

  if not newTracks or newTracks:size() == 0 then
    print("Erreur : impossible de créer la piste.")
    return
  end

  local track = newTracks:front()
  print("Piste créée : " .. trackName)

  -- ── Ajout du plugin IEM AllRADecoder (VST2/lxvst) ────────────
  -- unique-id VST2 : 1097614437
  local proc = ARDOUR.LuaAPI.new_plugin(Session, "1097614437", ARDOUR.PluginType.LXVST, "")

  if proc:isnil() then
    proc = ARDOUR.LuaAPI.new_plugin(Session, "AllRADecoder", ARDOUR.PluginType.LXVST, "")
  end

  if proc:isnil() then
    print("⚠ IEM AllRADecoder introuvable.")
    print("Vérifiez : Options > Plugin Manager > VST2")
    print("Chemin attendu : /usr/lib/x86_64-linux-gnu/iem-plugin-suite/vst/")
  else
    local ok = track:add_processor_by_index(proc, 4, nil, true)
    if ok then
      print("AllRADecoder ajouté.")

      -- inputOrderSetting=0 (auto) et useSN3D=1 sont les valeurs par défaut
      -- d'IEM AllRADecoder – le layout est chargé via le fichier XML ci-dessous.

      -- ── Écriture de l'état XML pour chargement manuel ─────────
      -- AllRADecoder accepte un fichier XML/JSON dans son UI
      local xmlParts = {}
      table.insert(xmlParts, '<?xml version="1.0" encoding="UTF-8"?>')
      table.insert(xmlParts, '<AllRADecoder inputOrderSetting="0" useSN3D="1" exportDecoder="1">')
      for i, sp in ipairs(speakers) do
        table.insert(xmlParts, string.format(
          '  <Loudspeaker Azimuth="%.4f" Elevation="%.4f" Radius="%.4f" Gain="1.0" Channel="%d" IsImaginary="0"/>',
          sp.az, sp.el, sp.r, i))
      end
      table.insert(xmlParts, '</AllRADecoder>')
      local xmlState = table.concat(xmlParts, '\n')

      local xmlPath = configDir .. "/allra_state.xml"
      local xf = io.open(xmlPath, "w")
      if xf then
        xf:write(xmlState)
        xf:close()
        print("État AllRADecoder sauvegardé : " .. xmlPath)
        print("")
        print("→ Dans le plugin AllRADecoder, cliquez sur 'Import' ou 'Load'")
        print("  et sélectionnez : " .. xmlPath)
      end
    else
      print("⚠ Impossible d'ajouter AllRADecoder à la piste.")
    end
  end

  -- ── Import du fichier AmbiX ────────────────────────────────────
  local importPos = Temporal.timepos_t(0)
  local files     = C.StringVector()
  files:push_back(ambiXPath)

  Editor:do_import(files,
    Editing.ImportDistinctFiles,
    Editing.ImportAsRegion,
    ARDOUR.SrcQuality.SrcBest,
    ARDOUR.MidiTrackNameSource.SMFTrackName,
    ARDOUR.MidiTempoMapDisposition.SMFTempoIgnore,
    importPos,
    ARDOUR.PluginInfo(),
    track,
    false)

  -- ── Placer la région sur la playlist ─────────────────────────
  local rname    = ambiXPath:match("([^/]+)%.wav$") or ambiXPath:match("([^/]+)$")
  local rl       = ARDOUR.RegionFactory.regions()
  local playlist = track:playlist()
  local placed   = false

  for _, region in rl:iter() do
    if region:whole_file() and not region:to_audioregion():isnil() then
      local rn = region:name()
      if rn == rname or rn:find(rname, 1, true) then
        playlist:add_region(region, importPos, 1, false)
        placed = true
        print("Région placée : " .. rn)
        break
      end
    end
  end

  if not placed then
    print("⚠ Région non placée automatiquement – vérifiez la liste des régions.")
  end

  print("✅ Import HOA AllRADecoder terminé.")
  print("Layout : " .. layoutName .. " – " .. nSpeakers .. " haut-parleurs")

end end
