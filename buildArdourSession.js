'use strict';
const fs = require('fs');

// Ardour 7/8 : 1 seconde = 508 032 000 superclocks
const SC = 508032000;

// ---------- helpers ----------------------------------------------------------

function readWavSamples(filePath) {
  try {
    const buf = Buffer.alloc(44);
    const fd  = fs.openSync(filePath, 'r');
    fs.readSync(fd, buf, 0, 44, 0);
    fs.closeSync(fd);
    const ch   = buf.readUInt16LE(22);
    const bits = buf.readUInt16LE(34);
    const data = buf.readUInt32LE(40);
    return data / (ch * bits / 8);
  } catch (e) {
    console.error('readWavSamples:', e.message, filePath);
    return 48000; // fallback 1 s
  }
}

// Samples → superclocks (préfixe 'a' + décimal, format Ardour 8)
function toSC(samples, sr) {
  return 'a' + Math.round(samples * SC / sr);
}

// "rrggbb[aa]" → entier ARGB uint32
function colorInt(hex) {
  const h = hex.replace(/[^0-9a-fA-F]/g, '').padStart(6, '0');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return ((255 << 24) | (r << 16) | (g << 8) | b) >>> 0;
}

function parseList(s) {
  if (!s || !s.trim()) return [0];
  return s.trim().split(',').map(v => { const n = parseFloat(v); return isNaN(n) ? 0 : n; });
}

// ---------- main export ------------------------------------------------------

function buildArdourSession(autoInsertContent, templateXml) {
  const lines = autoInsertContent.split('\n').map(l => l.replace(/\r$/, '').trim());
  if (lines.length < 6) return templateXml;

  const directory = lines[0].replace(/\/?$/, '/');
  const plugin3D  = (lines[1] || 'dominium').trim();
  const pluginCn  = parseInt(lines[2]) || 18;
  const fileSR    = parseInt(lines[3]) || 48000;
  const gainStr   = lines[4] || '';

  // Lire le sample-rate de la session depuis le template
  const srM = templateXml.match(/sample-rate="(\d+)"/);
  const sessionSR = srM ? parseInt(srM[1]) : fileSR;

  const dataLines = lines.slice(5).filter(l => l.length > 0);
  const objects = dataLines.map(line => {
    const it = line.split(';');
    return {
      name:     (it[0] || '').trim(),
      color:    (it[1] || 'ffffffff').trim(),
      filename: (it[2] || '').trim(),
      trackNum: parseInt(it[3]) || 1,
      position: parseInt(it[4]) || 0,
      spacet: parseList(it[5]),
      spacex: parseList(it[6]),
      spacey: parseList(it[7]),
      spacez: parseList(it[8]),
      spaced: parseList(it[9]),
    };
  }).filter(o => o.filename);

  if (!objects.length) return templateXml;

  // Offset depuis la position du premier objet (en samples session)
  const offsetpos = Math.floor(objects[0].position / fileSR * sessionSR);

  // Compteur d'IDs (au-dessus des IDs du template)
  let idC = 100000;
  const nid = () => String(idC++);

  const trackNums = [...new Set(objects.map(o => o.trackNum))].sort((a, b) => a - b);

  // Info par fichier audio
  const files = {};
  for (const obj of objects) {
    if (!files[obj.filename]) {
      const fp = directory + 'exports/' + obj.filename + '.wav';
      files[obj.filename] = {
        path: fp,
        len:  readWavSamples(fp),
        s0: nid(), s1: nid(),  // source ch0, ch1
        wr: nid(),              // whole-file region
      };
    }
  }

  // IDs par piste
  const tids = {};
  for (const tn of trackNums) {
    tids[tn] = {
      route: nid(), playlist: nid(),
      inIo: nid(), outIo: nid(),
      dw: nid(), dr: nid(), tb: nid(), pol: nid(),
      trimId: nid(), trimAl: nid(), trimCtrl: nid(),
      ampId:  nid(), ampAl:  nid(), ampCtrl:  nid(),
      lv2Id: nid(),
      al0: nid(), al1: nid(), al2: nid(), al3: nid(), al4: nid(),
      c0:  nid(), c1:  nid(), c2:  nid(), c3:  nid(), c4:  nid(),
      metId: nid(), moId: nid(),
      panAlAz: nid(), panAlW: nid(),
      panCtAz: nid(), panCtW: nid(),
    };
  }

  // ID par région placée
  const objRids = objects.map(() => nid());

  // URI du plugin
  const pluginURI = ({
    dominium: 'https://faustlv2.bitbucket.io/dominium',
    cone:     'https://faustlv2.bitbucket.io/cone',
  })[plugin3D] || `https://faustlv2.bitbucket.io/${plugin3D}`;

  // ── SOURCES ────────────────────────────────────────────────────────────────
  let sources = '<Sources>\n';
  for (const [name, fi] of Object.entries(files)) {
    for (const ch of [0, 1]) {
      const sid = ch === 0 ? fi.s0 : fi.s1;
      sources += `  <Source type="audio" name="${name}.wav" id="${sid}" ` +
        `origin="${fi.path}" flags="CanRename,ExternalToSession" ` +
        `natural-position="0" natural-length="${fi.len}" length="${fi.len}" ` +
        `start="0" channel="${ch}" captured-xruns="" timeline-position="0"/>\n`;
    }
  }
  sources += '</Sources>';

  // ── RÉGIONS WHOLE-FILE ─────────────────────────────────────────────────────
  let regions = '<Regions>\n';
  for (const [name, fi] of Object.entries(files)) {
    regions += `  <Region id="${fi.wr}" name="${name}" ` +
      `start="0" length="${fi.len}" position="0" ` +
      `sync-marked="0" left-of-split="0" right-of-split="0" ` +
      `ancestral-start="0" ancestral-length="${fi.len}" ` +
      `scale-amplitude="1" whole-file="1" import="0" external="1" ` +
      `opaque="1" locked="0" video-locked="0" automatic="0" three-sixty="0" ` +
      `used="1" is-embedded="1" ` +
      `source-0="${fi.s0}" source-1="${fi.s1}" ` +
      `master-source-0="${fi.s0}" master-source-1="${fi.s1}"/>\n`;
  }
  regions += '</Regions>';

  // ── AUTOMATION GAIN MASTER ─────────────────────────────────────────────────
  let masterGainEvts = '';
  if (gainStr) {
    for (const pair of gainStr.split(';')) {
      const m = pair.match(/([^,]+),([^,]+)/);
      if (m) {
        const t   = parseFloat(m[1]) || 0;
        const mul = Math.max(0.0001, parseFloat(m[2]) || 0.0001);
        masterGainEvts += `${toSC(t * sessionSR, sessionSR)} ${mul}\n`;
      }
    }
  }

  // ── PISTES (Routes) ────────────────────────────────────────────────────────
  let routes = '';
  for (const tn of trackNums) {
    const ti   = tids[tn];
    const objs = objects.filter(o => o.trackNum === tn);
    const col  = colorInt(objs[0]?.color || 'ffffffff');

    const outPorts = Array.from({ length: pluginCn }, (_, i) => {
      const conn = i < 2 ? `<Connection other="Master/audio_in ${i + 1}"/>` : '';
      return `      <Port name="track${tn}/audio_out ${i + 1}">${conn}</Port>`;
    }).join('\n');

    const outMap = Array.from({ length: pluginCn }, (_, i) =>
      `        <Channelmap type="audio" from="${i}" to="${i}"/>`
    ).join('\n');

    const ev = { 0: '', 1: '', 2: '', 4: '' };
    for (const obj of objs) {
      const fi  = files[obj.filename];
      const pos = Math.floor(obj.position / fileSR * sessionSR) - offsetpos;
      const rl  = fi.len;

      const st = [...obj.spacet, 1];
      const sx = [...obj.spacex, obj.spacex.at(-1)];
      const sy = [...obj.spacey, obj.spacey.at(-1)];
      const sz = [...obj.spacez, obj.spacez.at(-1)];
      const sd = [...obj.spaced, obj.spaced.at(-1)];

      for (let i = 0; i < st.length; i++) {
        const abs = pos + Math.floor(st[i] * rl);
        ev[0] += `${toSC(abs, sessionSR)} ${sx[i]}\n`;
        ev[1] += `${toSC(abs, sessionSR)} ${sy[i]}\n`;
        ev[2] += `${toSC(abs, sessionSR)} ${sz[i]}\n`;
        ev[4] += `${toSC(abs, sessionSR)} ${sd[i]}\n`;
      }
    }

    const alState = k => ev[k] ? 'Play' : 'Off';
    const alEvts  = k => ev[k] ? `<events>${ev[k]}</events>` : '';

    routes += `
  <Route version="7003" id="${ti.route}" name="track${tn}" default-type="audio"
         strict-io="0" active="1" denormal-protection="0"
         meter-point="MeterPostFader" disk-io-point="DiskIOPreFader"
         meter-type="MeterPeak" audio-playlist="${ti.playlist}"
         saved-meter-point="MeterPostFader" alignment-choice="Automatic" mode="Normal">
    <PresentationInfo order="${tn}" flags="AudioTrack,OrderSet" color="${col}"/>
    <IO name="track${tn}" id="${ti.inIo}" direction="Input" default-type="audio">
      <Port name="track${tn}/audio_in 1"/>
      <Port name="track${tn}/audio_in 2"/>
    </IO>
    <IO name="track${tn}" id="${ti.outIo}" direction="Output" default-type="audio">
${outPorts}
    </IO>
    <Processor id="${ti.dw}"    name="recorder:track${tn}" active="0" user-latency="0" use-user-latency="0" type="diskwriter"/>
    <Processor id="${ti.dr}"    name="player:track${tn}"   active="1" user-latency="0" use-user-latency="0" type="diskreader"/>
    <Processor id="${ti.tb}"    name="triggerbox:track${tn}" active="0" user-latency="0" use-user-latency="0" type="triggerbox"/>
    <Processor id="${ti.pol}"   name="polarity:track${tn}" active="1" user-latency="0" use-user-latency="0" type="polarity"/>
    <Processor id="${ti.trimId}" name="Trim" active="1" user-latency="0" use-user-latency="0" type="trim">
      <Automation>
        <AutomationList automation-id="trim" id="${ti.trimAl}" interpolation-style="Exponential" time-domain="AudioTime" state="Off"/>
      </Automation>
      <Controllable name="trimcontrol" id="${ti.trimCtrl}" flags="GainLike" value="1"/>
    </Processor>
    <Processor id="${ti.ampId}" name="Fader" active="1" user-latency="0" use-user-latency="0" type="amp">
      <Automation>
        <AutomationList automation-id="gain" id="${ti.ampAl}" interpolation-style="Exponential" time-domain="AudioTime" state="Off"/>
      </Automation>
      <Controllable name="gaincontrol" id="${ti.ampCtrl}" flags="GainLike" value="1"/>
    </Processor>
    <Processor id="${ti.lv2Id}" name="${plugin3D}" active="1" user-latency="0" use-user-latency="0" type="lv2" unique-id="${pluginURI}" count="1" custom="0">
      <Automation>
        <AutomationList automation-id="parameter-0" id="${ti.al0}" interpolation-style="Linear" time-domain="AudioTime" state="${alState(0)}">${alEvts(0)}</AutomationList>
        <AutomationList automation-id="parameter-1" id="${ti.al1}" interpolation-style="Linear" time-domain="AudioTime" state="${alState(1)}">${alEvts(1)}</AutomationList>
        <AutomationList automation-id="parameter-2" id="${ti.al2}" interpolation-style="Linear" time-domain="AudioTime" state="${alState(2)}">${alEvts(2)}</AutomationList>
        <AutomationList automation-id="parameter-3" id="${ti.al3}" interpolation-style="Linear" time-domain="AudioTime" state="Off"/>
        <AutomationList automation-id="parameter-4" id="${ti.al4}" interpolation-style="Linear" time-domain="AudioTime" state="${alState(4)}">${alEvts(4)}</AutomationList>
      </Automation>
      <ConfiguredInput><Channels type="audio" count="2"/></ConfiguredInput>
      <ConfiguredOutput><Channels type="audio" count="${pluginCn}"/></ConfiguredOutput>
      <InputMap-0>
        <Channelmap type="audio" from="0" to="0"/>
        <Channelmap type="audio" from="1" to="1"/>
      </InputMap-0>
      <OutputMap-0>
${outMap}
      </OutputMap-0>
      <lv2>
        <Port symbol="X1_0" value="0"/>
        <Port symbol="Y1_1" value="0"/>
        <Port symbol="Z1_2" value="0"/>
        <Port symbol="Hot_Spot_3" value="-20"/>
        <Port symbol="dt_4" value="1"/>
      </lv2>
      <Controllable name="X1"       id="${ti.c0}" parameter="0" symbol="X1_0"/>
      <Controllable name="Y1"       id="${ti.c1}" parameter="1" symbol="Y1_1"/>
      <Controllable name="Z1"       id="${ti.c2}" parameter="2" symbol="Z1_2"/>
      <Controllable name="Hot Spot" id="${ti.c3}" parameter="3" symbol="Hot_Spot_3"/>
      <Controllable name="dt"       id="${ti.c4}" parameter="4" symbol="dt_4"/>
    </Processor>
    <Processor id="${ti.metId}" name="meter:track${tn}" active="1" user-latency="0" use-user-latency="0" type="meter"/>
    <Processor id="${ti.moId}"  name="main outs" active="1" user-latency="0" use-user-latency="0" type="main-outs" output="track${tn}">
      <PannerShell bypassed="1" user-panner="" linked-to-route="0">
        <Pannable>
          <Automation>
            <AutomationList automation-id="pan-azimuth" id="${ti.panAlAz}" interpolation-style="Linear" time-domain="AudioTime" state="Off"/>
            <AutomationList automation-id="pan-width"   id="${ti.panAlW}"  interpolation-style="Linear" time-domain="AudioTime" state="Off"/>
          </Automation>
          <Controllable name="pan-azimuth" id="${ti.panCtAz}" flags="" value="0.5"/>
          <Controllable name="pan-width"   id="${ti.panCtW}"  flags="" value="0"/>
        </Pannable>
      </PannerShell>
    </Processor>
  </Route>`;
  }

  // ── PLAYLISTS ──────────────────────────────────────────────────────────────
  let playlists = '<Playlists>\n';
  for (const tn of trackNums) {
    const ti   = tids[tn];
    const objs = objects.filter(o => o.trackNum === tn);
    playlists += `  <Playlist id="${ti.playlist}" name="track${tn}" type="audio" ` +
      `orig-track-id="${ti.route}" pgroup-id="" shared-with-ids="" frozen="0" combine-ops="0">\n`;
    for (const obj of objs) {
      const fi     = files[obj.filename];
      const pos    = Math.max(0, Math.floor(obj.position / fileSR * sessionSR) - offsetpos);
      const rid    = objRids[objects.indexOf(obj)];
      playlists += `    <Region id="${rid}" name="${obj.filename}" ` +
        `start="0" length="${fi.len}" position="${pos}" ` +
        `sync-marked="0" left-of-split="0" right-of-split="0" ` +
        `ancestral-start="0" ancestral-length="${fi.len}" ` +
        `scale-amplitude="1" whole-file="0" import="0" external="1" ` +
        `opaque="1" locked="0" video-locked="0" automatic="0" three-sixty="0" ` +
        `used="1" is-embedded="1" ` +
        `source-0="${fi.s0}" source-1="${fi.s1}" ` +
        `master-source-0="${fi.s0}" master-source-1="${fi.s1}"/>\n`;
    }
    playlists += `  </Playlist>\n`;
  }
  playlists += '</Playlists>';

  // ── ASSEMBLAGE FINAL ───────────────────────────────────────────────────────
  let xml = templateXml;

  // id-counter
  xml = xml.replace(/id-counter="\d+"/, `id-counter="${idC + 1000}"`);

  // Sources
  xml = xml.replace(/<Sources[\s\S]*?(?:\s*\/>|>[\s\S]*?<\/Sources>)/, sources);

  // Regions
  xml = xml.replace(/<Regions[\s\S]*?(?:\s*\/>|>[\s\S]*?<\/Regions>)/, regions);

  // Supprimer les Routes de pistes existantes (garder seulement Master)
  xml = xml.replace(/<Route\s[^>]*audio-playlist[\s\S]*?<\/Route>\s*/g, '');

  // Insérer les nouvelles pistes avant </Routes>
  xml = xml.replace(/<\/Routes>/, routes + '\n</Routes>');

  // Playlists
  xml = xml.replace(/<Playlists[\s\S]*?(?:\s*\/>|>[\s\S]*?<\/Playlists>)/, playlists);

  // Automation gain Master
  if (masterGainEvts) {
    xml = xml.replace(
      /(<Processor[^>]*name="Amp"[^>]*>[\s\S]*?<AutomationList automation-id="gain"[^>]*)(\s*\/>)/,
      `$1 state="Play"><events>${masterGainEvts}</events></AutomationList>`
    );
  }

  return xml;
}

module.exports = { buildArdourSession };
