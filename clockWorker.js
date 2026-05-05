// Web Worker timer — isolé du thread principal (GC, DOM)
// Reçoit { type: 'next', delay } pour planifier le prochain tick
// Reçoit { type: 'stop' } pour annuler
let timerId = null;

self.onmessage = function({ data }) {
  clearTimeout(timerId);
  timerId = null;
  if (data.type === 'next') {
    timerId = setTimeout(() => postMessage('tick'), data.delay);
  }
};
