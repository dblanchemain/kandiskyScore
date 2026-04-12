ardour {
  ["type"]    = "EditorAction",
  name        = "HOA AmbiX – IEM BinauralDecoder",
  author      = "D.Blanchemain / Claude",
  description = "Importe partition_ambiX.wav (HOA) et ajoute IEM BinauralDecoder (LXVST). Config lue depuis ~/.config/kandiskyscore/kandiskyscore_hoa.txt",
}

function factory () return function ()

  -- ── Lecture du fichier de config généré par KandiskyScore ─────
  local home       = os.getenv("HOME") or ""
  local configDir  = (os.getenv("XDG_CONFIG_HOME") or (home .. "/.config")) .. "/kandiskyscore"
  local configPath = configDir .. "/kandiskyscore_hoa.txt"

  local file, err = io.open(configPath, "r")
  if not file then
    print("Erreur : fichier de config introuvable : " .. configPath)
    print("Lancez d'abord l'export HOA depuis KandiskyScore (menu HOA).")
    return
  end

  local lines = {}
  for line in file:lines() do table.insert(lines, line) end
  io.close(file)

  local ambiXPath  = lines[1] or ""
  local hoaOrder   = tonumber(lines[2]) or 7
  local sampleRate = tonumber(lines[3]) or 48000
  local nHoaCh     = (hoaOrder + 1) * (hoaOrder + 1)

  if ambiXPath == "" then
    print("Erreur : chemin du fichier AmbiX manquant dans " .. configPath)
    return
  end

  -- Vérifier que le fichier source existe
  local f = io.open(ambiXPath, "r")
  if not f then
    print("Erreur : fichier introuvable : " .. ambiXPath)
    return
  end
  io.close(f)

  print("=== Import HOA AmbiX – IEM BinauralDecoder ===")
  print("Fichier  : " .. ambiXPath)
  print("Ordre HOA: " .. hoaOrder .. " (" .. nHoaCh .. " canaux)")

  -- ── Création de la piste HOA (nHoaCh entrées, 2 sorties binaural) ──
  local trackName = "HOA AmbiX " .. nHoaCh .. "ch"
  local newTracks = Session:new_audio_track(nHoaCh, 2, nil, 1, trackName,
    ARDOUR.PresentationInfo.max_order, ARDOUR.TrackMode.Normal, true)

  if not newTracks or newTracks:size() == 0 then
    print("Erreur : impossible de créer la piste " .. trackName)
    return
  end

  local track = newTracks:front()
  print("Piste créée : " .. trackName)

  -- ── Ajout du plugin IEM BinauralDecoder (VST2/lxvst) ─────────
  -- unique-id VST2 : 1114195045
  local proc = ARDOUR.LuaAPI.new_plugin(Session, "1114195045", ARDOUR.PluginType.LXVST, "")

  if proc:isnil() then
    -- Essai par nom
    proc = ARDOUR.LuaAPI.new_plugin(Session, "BinauralDecoder", ARDOUR.PluginType.LXVST, "")
  end

  if proc:isnil() then
    print("⚠ IEM BinauralDecoder introuvable.")
    print("Vérifiez : Options > Plugin Manager > VST2")
    print("Chemin attendu : /usr/lib/x86_64-linux-gnu/iem-plugin-suite/vst/")
  else
    -- Insérer après le fader (index 4)
    local ok = track:add_processor_by_index(proc, 4, nil, true)
    if ok then
      print("BinauralDecoder ajouté.")

      -- Réglage des paramètres via les contrôles d'automation
      local plug = track:nth_plugin(0)
      if plug and not plug:isnil() then
        -- Paramètre 0 : inputOrderSetting = 0 (automatique)
        local _, c0 = ARDOUR.LuaAPI.plugin_automation(plug, 0)
        if c0 and not c0:isnil() then
          c0:set_value(0.0, PBD.GroupControlDisposition.NoGroup)
          print("inputOrderSetting : automatique (0.0)")
        end
        -- Paramètre 1 : applyHeadphoneEq = 0 (désactivé)
        local _, c1 = ARDOUR.LuaAPI.plugin_automation(plug, 1)
        if c1 and not c1:isnil() then
          c1:set_value(0.0, PBD.GroupControlDisposition.NoGroup)
        end
      end
    else
      print("⚠ Impossible d'ajouter BinauralDecoder à la piste.")
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

  print("✅ Import HOA BinauralDecoder terminé.")

end end
