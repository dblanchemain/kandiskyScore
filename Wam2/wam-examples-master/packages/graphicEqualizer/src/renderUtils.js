export async function renderProcessedAudio(player, pluginInstance) {
  const sampleRate = 44100;
  const durationInSeconds = player.duration;
  const lengthInFrames = Math.ceil(durationInSeconds * sampleRate);
  const numberOfChannels = 2;

  const offlineCtx = new OfflineAudioContext(numberOfChannels, lengthInFrames, sampleRate);

  const response = await fetch(player.src);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await offlineCtx.decodeAudioData(arrayBuffer);

  const bufferSource = offlineCtx.createBufferSource();
  bufferSource.buffer = audioBuffer;

  const wamNode = await pluginInstance.constructor.createInstance(
    pluginInstance.groupId,
    offlineCtx,
    {}
  );
  await wamNode.audioNode.initialize();

  bufferSource.connect(wamNode.audioNode);
  wamNode.audioNode.connect(offlineCtx.destination);

  bufferSource.start();
  const renderedBuffer = await offlineCtx.startRendering();
  return renderedBuffer;
}

export function audioBufferToWavBlob(buffer) {
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const length = buffer.length * numberOfChannels * 2 + 44;
  const wav = new ArrayBuffer(length);
  const view = new DataView(wav);

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  let offset = 0;
  writeString(view, offset, 'RIFF'); offset += 4;
  view.setUint32(offset, length - 8, true); offset += 4;
  writeString(view, offset, 'WAVE'); offset += 4;
  writeString(view, offset, 'fmt '); offset += 4;
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint16(offset, numberOfChannels, true); offset += 2;
  view.setUint32(offset, sampleRate, true); offset += 4;
  view.setUint32(offset, sampleRate * numberOfChannels * 2, true); offset += 4;
  view.setUint16(offset, numberOfChannels * 2, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  writeString(view, offset, 'data'); offset += 4;
  view.setUint32(offset, length - offset - 4, true); offset += 4;

  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const sample = buffer.getChannelData(channel)[i];
      const s = Math.max(-1, Math.min(1, sample));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      offset += 2;
    }
  }

  return new Blob([view], { type: 'audio/wav' });
}