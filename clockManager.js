// Horloge maître — deux modes : 'internal' (AudioContext) | 'midi' (MIDI Clock IN)
//
// Mode internal : position calculée depuis contextAudio.currentTime (drift-free).
// Mode midi     : position avancée par les pulses MIDI Clock (24 PPQN).
//                 Le transport Start/Continue/Stop MIDI pilote readPart().
//                 Le BPM est affiché en temps réel, moyenné sur 8 pulses.
const clockManager = {
  mode: 'internal', // 'internal' | 'midi'

  // --- Mode interne ---
  _startAudioTime: 0,
  _startBarLeft: 0,

  // --- Mode MIDI ---
  _midiBarLeft: 0,
  _midiRunning: false,
  _bpmHistory: [],   // intervalles inter-pulse (ms) — moyenne glissante
  _lastPulseAt: 0,

  start(barLeft) {
    this._startAudioTime = contextAudio.currentTime;
    this._startBarLeft = barLeft;
    if (this.mode === 'midi') {
      this._midiBarLeft = barLeft;
      this._midiRunning = true;
    }
  },

  stop() {
    if (this.mode === 'midi') this._midiRunning = false;
  },

  barLeft() {
    if (this.mode === 'midi') return this._midiBarLeft;
    return this._startBarLeft + timeToPixel(contextAudio.currentTime - this._startAudioTime);
  },

  // --- Traitement des messages MIDI ---
  _onMidiMsg(msg) {
    const s = msg.data[0];

    if (s === 0xF8) { // Clock pulse — 24 PPQN
      if (!this._midiRunning) return;
      const now = performance.now();
      if (this._lastPulseAt > 0) {
        // Avancement basé sur le temps réel écoulé (dt), pas sur le BPM.
        // Donne 18*zoomScale px/sec quelle que soit la vitesse Reaper,
        // et slave précisément sur son horloge audio.
        const dt = (now - this._lastPulseAt) / 1000;
        this._midiBarLeft += 18 * zoomScale * dt;
        // Calcul et affichage du BPM (moyenne glissante sur 8 intervalles)
        this._bpmHistory.push(now - this._lastPulseAt);
        if (this._bpmHistory.length > 8) this._bpmHistory.shift();
        const avgMs = this._bpmHistory.reduce((a, b) => a + b) / this._bpmHistory.length;
        document.getElementById("tempo").value = (60000 / (avgMs * 24)).toFixed(1);
      }
      this._lastPulseAt = now;

    } else if (s === 0xFA) { // Start — retour au début
      if (playerStat === 1) readPart();              // stop si lecture en cours
      document.getElementById("barVerticale").style.left = "0px";
      this._midiRunning = false;
      this._bpmHistory = [];
      this._lastPulseAt = 0;
      readPart();                                    // démarre la lecture

    } else if (s === 0xFB) { // Continue — reprend depuis la position courante
      if (playerStat === 0) {
        this._midiRunning = false;
        this._bpmHistory = [];
        this._lastPulseAt = 0;
        readPart();
      }

    } else if (s === 0xFC) { // Stop
      if (playerStat === 1) readPart();
      this._midiRunning = false;
    }
  },

  // Initialise l'accès MIDI, attache les handlers sur les ports IN.
  // portName : si fourni, n'écoute que ce port ; sinon écoute tous.
  // Résout en tableau de { id, name } — vide si MIDI indisponible.
  async setupMIDI(portName) {
    if (!navigator.requestMIDIAccess) {
      console.warn('[clockManager] Web MIDI API non disponible dans cet environnement');
      return [];
    }
    try {
      const access = await navigator.requestMIDIAccess({ sysex: false });
      const ports = [];
      for (const input of access.inputs.values()) {
        if (portName && input.name !== portName) continue;
        input.onmidimessage = (msg) => this._onMidiMsg(msg);
        ports.push({ id: input.id, name: input.name });
      }
      if (ports.length === 0) {
        console.warn('[clockManager] Aucun port MIDI IN détecté');
      } else {
        console.log('[clockManager] Ports MIDI IN actifs :', ports.map(p => p.name).join(', '));
      }
      return ports;
    } catch (e) {
      console.warn('[clockManager] Accès MIDI refusé :', e.message);
      return [];
    }
  }
};
