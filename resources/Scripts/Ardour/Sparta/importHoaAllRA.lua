ardour {
  ["type"]    = "EditorAction",
  name        = "HOA AmbiX – Sparta ambiDEC",
  author      = "D.Blanchemain / Claude",
  description = "Importe partition_ambiX.wav (HOA) et ajoute Sparta ambiDEC configuré avec le layout KandiskyScore. Config lue depuis ~/.config/kandiskyscore/kandiskyscore_allra.txt",
}

function factory () return function ()

  -- ── Lecture du fichier de config généré par KandiskyScore ─────
  local home = os.getenv("HOME") or os.getenv("USERPROFILE") or ""
  local configDir
  if package.config:sub(1,1) == "\\" then
    -- Windows : %APPDATA%\kandiskyscore
    configDir = (os.getenv("APPDATA") or (home .. "\\AppData\\Roaming")) .. "\\kandiskyscore"
  elseif os.getenv("TMPDIR") and os.getenv("TMPDIR"):find("/var/folders") then
    -- macOS : ~/Library/Application Support/kandiskyscore
    configDir = home .. "/Library/Application Support/kandiskyscore"
  else
    -- Linux XDG
    configDir = (os.getenv("XDG_CONFIG_HOME") or (home .. "/.config")) .. "/kandiskyscore"
  end
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

  local f = io.open(ambiXPath, "r")
  if not f then
    print("Erreur : fichier introuvable : " .. ambiXPath)
    return
  end
  io.close(f)

  -- Lire les positions az,el,radius
  local speakers = {}
  for i = 1, nSpeakers do
    local ln = lines[5 + i] or "0,0,1"
    local az, el, r = ln:match("([^,]+),([^,]+),([^,]+)")
    table.insert(speakers, { az = az or "0", el = el or "0", r = r or "1" })
  end

  print("=== Import HOA AmbiX – Sparta ambiDEC ===")
  print("Fichier  : " .. ambiXPath)
  print("Layout   : " .. layoutName .. " (" .. nSpeakers .. " HP)")
  print("Ordre HOA: " .. hoaOrder .. " (" .. nHoaCh .. " canaux)")

  -- ── Création de la piste HOA ──────────────────────────────────
  local trackName = "HOA " .. layoutName .. " " .. nSpeakers .. "HP"
  local newTracks = Session:new_audio_track(nHoaCh, nSpeakers, nil, 1, trackName,
    ARDOUR.PresentationInfo.max_order, ARDOUR.TrackMode.Normal, true)

  if not newTracks or newTracks:size() == 0 then
    print("Erreur : impossible de créer la piste.")
    return
  end

  local track = newTracks:front()
  print("Piste créée : " .. trackName)

  -- ── Ajout du plugin Sparta ambiDEC (VST2/lxvst) ──────────────
  -- Essai par nom (le nom exact dépend de l'installation Sparta)
  local proc = ARDOUR.LuaAPI.new_plugin(Session, "sparta_ambiDEC", ARDOUR.PluginType.LXVST, "")

  if proc:isnil() then
    proc = ARDOUR.LuaAPI.new_plugin(Session, "ambiDEC", ARDOUR.PluginType.LXVST, "")
  end

  if proc:isnil() then
    print("⚠ Sparta ambiDEC introuvable.")
    print("Vérifiez : Options > Plugin Manager > VST2")
    print("Assurez-vous que le dossier Sparta est scanné.")
  else
    local ok = track:add_processor_by_index(proc, 4, nil, true)
    if ok then
      print("sparta_ambiDEC ajouté.")
    else
      print("⚠ Impossible d'ajouter ambiDEC à la piste.")
    end
  end

  -- ── Générer le fichier de layout Sparta ambiDEC ───────────────
  -- Format JSON attendu par Sparta ambiDEC pour l'import de preset
  local exportDir = ambiXPath:match("^(.*)[/\\][^/\\]*$") or configDir
  local jsonFile  = exportDir .. "/sparta_ambiDEC_layout.json"

  local jsonLines = {}
  table.insert(jsonLines, '{')
  table.insert(jsonLines, '  "num_ls": ' .. nSpeakers .. ',')
  table.insert(jsonLines, '  "ls_dirs_deg": [')
  for i, sp in ipairs(speakers) do
    local sep = (i < nSpeakers) and "," or ""
    table.insert(jsonLines, "    [" .. sp.az .. ", " .. sp.el .. "]" .. sep)
  end
  table.insert(jsonLines, '  ]')
  table.insert(jsonLines, '}')

  local jf = io.open(jsonFile, "w")
  if jf then
    jf:write(table.concat(jsonLines, "\n"))
    jf:close()
    print("Layout JSON Sparta : " .. jsonFile)
    print("")
    print("→ Dans ambiDEC : bouton 'Load' → sélectionner :")
    print("  " .. jsonFile)
  else
    print("⚠ Impossible d'écrire le fichier JSON de layout.")
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

  print("✅ Import HOA Sparta ambiDEC terminé.")
  print("Layout : " .. layoutName .. " – " .. nSpeakers .. " haut-parleurs")

end end
