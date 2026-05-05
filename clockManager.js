// Horloge maître basée sur AudioContext.currentTime.
// La position de la barre est calculée depuis le temps audio réel,
// éliminant la dérive cumulée du comptage de ticks (±50ms → ~0.02ms).
// Le Web Worker (clockWorker.js) assure la cadence ; clockManager fournit la position.
const clockManager = {
  _startAudioTime: 0,
  _startBarLeft: 0,

  start(barLeft) {
    this._startAudioTime = contextAudio.currentTime;
    this._startBarLeft = barLeft;
  },

  stop() {},  // réservé pour l'intégration rAF (étape future)

  barLeft() {
    return this._startBarLeft + timeToPixel(contextAudio.currentTime - this._startAudioTime);
  }
};
