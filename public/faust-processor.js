class FaustProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super();

    // Charger le module WASM passé via options
    this.wasmInstance = options.processorOptions.wasmInstance;
    this.numChannels = options.processorOptions.numChannels;

    // Créer un buffer temporaire pour le traitement
    this.inputBuffer = new Float32Array(128);
    this.outputBuffer = new Float32Array(128);
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];

    for (let c = 0; c < this.numChannels; c++) {
      const inChannel = input[c] || new Float32Array(128);
      const outChannel = output[c];

      // Copier les données dans inputBuffer
      this.inputBuffer.set(inChannel);

      // ⚡ Appeler le compute du DSP WASM
      if (this.wasmInstance.exports.compute) {
        // simple traitement échantillon par échantillon
        for (let i = 0; i < 128; i++) {
          outChannel[i] = this.wasmInstance.exports.compute(this.inputBuffer[i]);
        }
      } else {
        // fallback : passage direct
        outChannel.set(inChannel);
      }
    }

    return true; // continuer
  }
}

registerProcessor('faust-processor', FaustProcessor);
