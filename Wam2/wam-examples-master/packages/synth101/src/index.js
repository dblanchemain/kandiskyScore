function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

// src/WebAudioModule.js
var WebAudioModule = class {
  static get isWebAudioModuleConstructor() {
    return true;
  }

  static createInstance(groupId, audioContext, initialState) {
    return new this(groupId, audioContext).initialize(initialState);
  }

  constructor(groupId, audioContext) {
    this._groupId = groupId;
    this._audioContext = audioContext;
    this._initialized = false;
    this._audioNode = void 0;
    this._timestamp = performance.now();
    this._guiModuleUrl = void 0;
    this._descriptorUrl = "./descriptor.json";
    this._descriptor = {
      identifier: `com.webaudiomodule.default`,
      name: `WebAudioModule_${this.constructor.name}`,
      vendor: "WebAudioModuleVendor",
      description: "",
      version: "0.0.0",
      apiVersion: "2.0.0",
      thumbnail: "",
      keywords: [],
      isInstrument: false,
      website: "",
      hasAudioInput: true,
      hasAudioOutput: true,
      hasAutomationInput: true,
      hasAutomationOutput: true,
      hasMidiInput: true,
      hasMidiOutput: true,
      hasMpeInput: true,
      hasMpeOutput: true,
      hasOscInput: true,
      hasOscOutput: true,
      hasSysexInput: true,
      hasSysexOutput: true
    };
  }

  get isWebAudioModule() {
    return true;
  }

  get groupId() {
    return this._groupId;
  }

  get moduleId() {
    return this.descriptor.identifier;
  }

  get instanceId() {
    return this.moduleId + this._timestamp;
  }

  get descriptor() {
    return this._descriptor;
  }

  get identifier() {
    return this.descriptor.identifier;
  }

  get name() {
    return this.descriptor.name;
  }

  get vendor() {
    return this.descriptor.vendor;
  }

  get audioContext() {
    return this._audioContext;
  }

  get audioNode() {
    if (!this.initialized) console.warn("WAM should be initialized before getting the audioNode");
    return this._audioNode;
  }

  set audioNode(node) {
    this._audioNode = node;
  }

  get initialized() {
    return this._initialized;
  }

  set initialized(value) {
    this._initialized = value;
  }

  async createAudioNode(initialState) {
    throw new TypeError("createAudioNode() not provided");
  }

  async initialize(state) {
    if (!this._audioNode) this.audioNode = await this.createAudioNode();
    this.initialized = true;
    return this;
  }

  async _loadGui() {
    const url = this._guiModuleUrl;
    if (!url) throw new TypeError("Gui module not found");
    return import(
    /* webpackIgnore: true */
    url);
  }

  async _loadDescriptor() {
    const url = this._descriptorUrl;
    if (!url) throw new TypeError("Descriptor not found");
    const response = await fetch(url);
    const descriptor = await response.json();
    Object.assign(this._descriptor, descriptor);
    return this._descriptor;
  }

  async createGui() {
    if (!this.initialized) console.warn("Plugin should be initialized before getting the gui");
    if (!this._guiModuleUrl) return void 0;
    const {
      createElement
    } = await this._loadGui();
    return createElement(this);
  }

  destroyGui() {}

};
var WebAudioModule_default = WebAudioModule; // src/RingBuffer.js

var getRingBuffer = moduleId => {
  const audioWorkletGlobalScope = globalThis;

  class RingBuffer2 {
    static getStorageForCapacity(capacity, Type) {
      if (!Type.BYTES_PER_ELEMENT) {
        throw new Error("Pass in a ArrayBuffer subclass");
      }

      const bytes = 8 + (capacity + 1) * Type.BYTES_PER_ELEMENT;
      return new SharedArrayBuffer(bytes);
    }

    constructor(sab, Type) {
      if (!Type.BYTES_PER_ELEMENT) {
        throw new Error("Pass a concrete typed array class as second argument");
      }

      this._Type = Type;
      this._capacity = (sab.byteLength - 8) / Type.BYTES_PER_ELEMENT;
      this.buf = sab;
      this.write_ptr = new Uint32Array(this.buf, 0, 1);
      this.read_ptr = new Uint32Array(this.buf, 4, 1);
      this.storage = new Type(this.buf, 8, this._capacity);
    }

    get type() {
      return this._Type.name;
    }

    push(elements) {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);

      if ((wr + 1) % this._storageCapacity() === rd) {
        return 0;
      }

      const toWrite = Math.min(this._availableWrite(rd, wr), elements.length);
      const firstPart = Math.min(this._storageCapacity() - wr, toWrite);
      const secondPart = toWrite - firstPart;

      this._copy(elements, 0, this.storage, wr, firstPart);

      this._copy(elements, firstPart, this.storage, 0, secondPart);

      Atomics.store(this.write_ptr, 0, (wr + toWrite) % this._storageCapacity());
      return toWrite;
    }

    pop(elements) {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);

      if (wr === rd) {
        return 0;
      }

      const isArray = !Number.isInteger(elements);
      const toRead = Math.min(this._availableRead(rd, wr), isArray ? elements.length : elements);

      if (isArray) {
        const firstPart = Math.min(this._storageCapacity() - rd, toRead);
        const secondPart = toRead - firstPart;

        this._copy(this.storage, rd, elements, 0, firstPart);

        this._copy(this.storage, 0, elements, firstPart, secondPart);
      }

      Atomics.store(this.read_ptr, 0, (rd + toRead) % this._storageCapacity());
      return toRead;
    }

    get empty() {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      return wr === rd;
    }

    get full() {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      return (wr + 1) % this._capacity !== rd;
    }

    get capacity() {
      return this._capacity - 1;
    }

    get availableRead() {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      return this._availableRead(rd, wr);
    }

    get availableWrite() {
      const rd = Atomics.load(this.read_ptr, 0);
      const wr = Atomics.load(this.write_ptr, 0);
      return this._availableWrite(rd, wr);
    }

    _availableRead(rd, wr) {
      if (wr > rd) {
        return wr - rd;
      }

      return wr + this._storageCapacity() - rd;
    }

    _availableWrite(rd, wr) {
      let rv = rd - wr - 1;

      if (wr >= rd) {
        rv += this._storageCapacity();
      }

      return rv;
    }

    _storageCapacity() {
      return this._capacity;
    }

    _copy(input, offsetInput, output, offsetOutput, size) {
      for (let i = 0; i < size; i++) {
        output[offsetOutput + i] = input[offsetInput + i];
      }
    }

  }

  if (audioWorkletGlobalScope.AudioWorkletProcessor) {
    const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
    if (!ModuleScope.RingBuffer) ModuleScope.RingBuffer = RingBuffer2;
  }

  return RingBuffer2;
};

var RingBuffer_default = getRingBuffer; // src/WamArrayRingBuffer.js

var getWamEventRingBuffer = moduleId => {
  const audioWorkletGlobalScope = globalThis;

  class WamEventRingBuffer2 {
    static DefaultExtraBytesPerEvent = 64;
    static WamEventBaseBytes = 4 + 1 + 8;
    static WamAutomationEventBytes = WamEventRingBuffer2.WamEventBaseBytes + 2 + 8 + 1;
    static WamTransportEventBytes = WamEventRingBuffer2.WamEventBaseBytes + 4 + 8 + 8 + 1 + 1 + 1;
    static WamMidiEventBytes = WamEventRingBuffer2.WamEventBaseBytes + 1 + 1 + 1;
    static WamBinaryEventBytes = WamEventRingBuffer2.WamEventBaseBytes + 4;

    static getStorageForEventCapacity(RingBuffer2, eventCapacity, maxBytesPerEvent = void 0) {
      if (maxBytesPerEvent === void 0) maxBytesPerEvent = WamEventRingBuffer2.DefaultExtraBytesPerEvent;else maxBytesPerEvent = Math.max(maxBytesPerEvent, WamEventRingBuffer2.DefaultExtraBytesPerEvent);
      const capacity = (Math.max(WamEventRingBuffer2.WamAutomationEventBytes, WamEventRingBuffer2.WamTransportEventBytes, WamEventRingBuffer2.WamMidiEventBytes, WamEventRingBuffer2.WamBinaryEventBytes) + maxBytesPerEvent) * eventCapacity;
      return RingBuffer2.getStorageForCapacity(capacity, Uint8Array);
    }

    constructor(RingBuffer2, sab, parameterIds, maxBytesPerEvent = void 0) {
      this._eventSizeBytes = {};
      this._encodeEventType = {};
      this._decodeEventType = {};
      const wamEventTypes = ["wam-automation", "wam-transport", "wam-midi", "wam-sysex", "wam-mpe", "wam-osc", "wam-info"];
      wamEventTypes.forEach((type, encodedType) => {
        let byteSize = 0;

        switch (type) {
          case "wam-automation":
            byteSize = WamEventRingBuffer2.WamAutomationEventBytes;
            break;

          case "wam-transport":
            byteSize = WamEventRingBuffer2.WamTransportEventBytes;
            break;

          case "wam-mpe":
          case "wam-midi":
            byteSize = WamEventRingBuffer2.WamMidiEventBytes;
            break;

          case "wam-osc":
          case "wam-sysex":
          case "wam-info":
            byteSize = WamEventRingBuffer2.WamBinaryEventBytes;
            break;
        }

        this._eventSizeBytes[type] = byteSize;
        this._encodeEventType[type] = encodedType;
        this._decodeEventType[encodedType] = type;
      });
      this._parameterCode = 0;
      this._parameterCodes = {};
      this._encodeParameterId = {};
      this._decodeParameterId = {};
      this.setParameterIds(parameterIds);
      this._sab = sab;
      if (maxBytesPerEvent === void 0) maxBytesPerEvent = WamEventRingBuffer2.DefaultExtraBytesPerEvent;else maxBytesPerEvent = Math.max(maxBytesPerEvent, WamEventRingBuffer2.DefaultExtraBytesPerEvent);
      this._eventBytesAvailable = Math.max(WamEventRingBuffer2.WamAutomationEventBytes, WamEventRingBuffer2.WamTransportEventBytes, WamEventRingBuffer2.WamMidiEventBytes, WamEventRingBuffer2.WamBinaryEventBytes) + maxBytesPerEvent;
      this._eventBytes = new ArrayBuffer(this._eventBytesAvailable);
      this._eventBytesView = new DataView(this._eventBytes);
      this._rb = new RingBuffer2(this._sab, Uint8Array);
      this._eventSizeArray = new Uint8Array(this._eventBytes, 0, 4);
      this._eventSizeView = new DataView(this._eventBytes, 0, 4);
    }

    _writeHeader(byteSize, type, time) {
      let byteOffset = 0;

      this._eventBytesView.setUint32(byteOffset, byteSize);

      byteOffset += 4;

      this._eventBytesView.setUint8(byteOffset, this._encodeEventType[type]);

      byteOffset += 1;

      this._eventBytesView.setFloat64(byteOffset, Number.isFinite(time) ? time : -1);

      byteOffset += 8;
      return byteOffset;
    }

    _encode(event) {
      let byteOffset = 0;
      const {
        type,
        time
      } = event;

      switch (event.type) {
        case "wam-automation":
          {
            if (!(event.data.id in this._encodeParameterId)) break;
            const byteSize = this._eventSizeBytes[type];
            byteOffset = this._writeHeader(byteSize, type, time);
            const {
              data
            } = event;
            const encodedParameterId = this._encodeParameterId[data.id];
            const {
              value,
              normalized
            } = data;

            this._eventBytesView.setUint16(byteOffset, encodedParameterId);

            byteOffset += 2;

            this._eventBytesView.setFloat64(byteOffset, value);

            byteOffset += 8;

            this._eventBytesView.setUint8(byteOffset, normalized ? 1 : 0);

            byteOffset += 1;
          }
          break;

        case "wam-transport":
          {
            const byteSize = this._eventSizeBytes[type];
            byteOffset = this._writeHeader(byteSize, type, time);
            const {
              data
            } = event;
            const {
              currentBar,
              currentBarStarted,
              tempo,
              timeSigNumerator,
              timeSigDenominator,
              playing
            } = data;

            this._eventBytesView.setUint32(byteOffset, currentBar);

            byteOffset += 4;

            this._eventBytesView.setFloat64(byteOffset, currentBarStarted);

            byteOffset += 8;

            this._eventBytesView.setFloat64(byteOffset, tempo);

            byteOffset += 8;

            this._eventBytesView.setUint8(byteOffset, timeSigNumerator);

            byteOffset += 1;

            this._eventBytesView.setUint8(byteOffset, timeSigDenominator);

            byteOffset += 1;

            this._eventBytesView.setUint8(byteOffset, playing ? 1 : 0);

            byteOffset += 1;
          }
          break;

        case "wam-mpe":
        case "wam-midi":
          {
            const byteSize = this._eventSizeBytes[type];
            byteOffset = this._writeHeader(byteSize, type, time);
            const {
              data
            } = event;
            const {
              bytes
            } = data;
            let b = 0;

            while (b < 3) {
              this._eventBytesView.setUint8(byteOffset, bytes[b]);

              byteOffset += 1;
              b++;
            }
          }
          break;

        case "wam-osc":
        case "wam-sysex":
        case "wam-info":
          {
            let bytes = null;

            if (event.type === "wam-info") {
              const {
                data
              } = event;
              bytes = new TextEncoder().encode(data.instanceId);
            } else {
              const {
                data
              } = event;
              bytes = data.bytes;
            }

            const numBytes = bytes.length;
            const byteSize = this._eventSizeBytes[type];
            byteOffset = this._writeHeader(byteSize + numBytes, type, time);

            this._eventBytesView.setUint32(byteOffset, numBytes);

            byteOffset += 4;
            const bytesRequired = byteOffset + numBytes;
            if (bytesRequired > this._eventBytesAvailable) console.error(`Event requires ${bytesRequired} bytes but only ${this._eventBytesAvailable} have been allocated!`);
            const buffer = new Uint8Array(this._eventBytes, byteOffset, numBytes);
            buffer.set(bytes);
            byteOffset += numBytes;
          }
          break;
      }

      return new Uint8Array(this._eventBytes, 0, byteOffset);
    }

    _decode() {
      let byteOffset = 0;

      const type = this._decodeEventType[this._eventBytesView.getUint8(byteOffset)];

      byteOffset += 1;

      let time = this._eventBytesView.getFloat64(byteOffset);

      if (time === -1) time = void 0;
      byteOffset += 8;

      switch (type) {
        case "wam-automation":
          {
            const encodedParameterId = this._eventBytesView.getUint16(byteOffset);

            byteOffset += 2;

            const value = this._eventBytesView.getFloat64(byteOffset);

            byteOffset += 8;
            const normalized = !!this._eventBytesView.getUint8(byteOffset);
            byteOffset += 1;
            if (!(encodedParameterId in this._decodeParameterId)) break;
            const id = this._decodeParameterId[encodedParameterId];
            const event = {
              type,
              time,
              data: {
                id,
                value,
                normalized
              }
            };
            return event;
          }

        case "wam-transport":
          {
            const currentBar = this._eventBytesView.getUint32(byteOffset);

            byteOffset += 4;

            const currentBarStarted = this._eventBytesView.getFloat64(byteOffset);

            byteOffset += 8;

            const tempo = this._eventBytesView.getFloat64(byteOffset);

            byteOffset += 8;

            const timeSigNumerator = this._eventBytesView.getUint8(byteOffset);

            byteOffset += 1;

            const timeSigDenominator = this._eventBytesView.getUint8(byteOffset);

            byteOffset += 1;
            const playing = this._eventBytesView.getUint8(byteOffset) == 1;
            byteOffset += 1;
            const event = {
              type,
              time,
              data: {
                currentBar,
                currentBarStarted,
                tempo,
                timeSigNumerator,
                timeSigDenominator,
                playing
              }
            };
            return event;
          }

        case "wam-mpe":
        case "wam-midi":
          {
            const bytes = [0, 0, 0];
            let b = 0;

            while (b < 3) {
              bytes[b] = this._eventBytesView.getUint8(byteOffset);
              byteOffset += 1;
              b++;
            }

            const event = {
              type,
              time,
              data: {
                bytes
              }
            };
            return event;
          }

        case "wam-osc":
        case "wam-sysex":
        case "wam-info":
          {
            const numBytes = this._eventBytesView.getUint32(byteOffset);

            byteOffset += 4;
            const bytes = new Uint8Array(numBytes);
            bytes.set(new Uint8Array(this._eventBytes, byteOffset, numBytes));
            byteOffset += numBytes;

            if (type === "wam-info") {
              const instanceId = new TextDecoder().decode(bytes);
              const data = {
                instanceId
              };
              return {
                type,
                time,
                data
              };
            } else {
              const data = {
                bytes
              };
              return {
                type,
                time,
                data
              };
            }
          }
      }

      return false;
    }

    write(...events) {
      const numEvents = events.length;
      let bytesAvailable = this._rb.availableWrite;
      let numSkipped = 0;
      let i = 0;

      while (i < numEvents) {
        const event = events[i];

        const bytes = this._encode(event);

        const eventSizeBytes = bytes.byteLength;
        let bytesWritten = 0;

        if (bytesAvailable >= eventSizeBytes) {
          if (eventSizeBytes === 0) numSkipped++;else bytesWritten = this._rb.push(bytes);
        } else break;

        bytesAvailable -= bytesWritten;
        i++;
      }

      return i - numSkipped;
    }

    read() {
      if (this._rb.empty) return [];
      const events = [];
      let bytesAvailable = this._rb.availableRead;
      let bytesRead = 0;

      while (bytesAvailable > 0) {
        bytesRead = this._rb.pop(this._eventSizeArray);
        bytesAvailable -= bytesRead;

        const eventSizeBytes = this._eventSizeView.getUint32(0);

        const eventBytes = new Uint8Array(this._eventBytes, 0, eventSizeBytes - 4);
        bytesRead = this._rb.pop(eventBytes);
        bytesAvailable -= bytesRead;

        const decodedEvent = this._decode();

        if (decodedEvent) events.push(decodedEvent);
      }

      return events;
    }

    setParameterIds(parameterIds) {
      this._encodeParameterId = {};
      this._decodeParameterId = {};
      parameterIds.forEach(parameterId => {
        let parameterCode = -1;
        if (parameterId in this._parameterCodes) parameterCode = this._parameterCodes[parameterId];else {
          parameterCode = this._generateParameterCode();
          this._parameterCodes[parameterId] = parameterCode;
        }
        this._encodeParameterId[parameterId] = parameterCode;
        this._decodeParameterId[parameterCode] = parameterId;
      });
    }

    _generateParameterCode() {
      if (this._parameterCode > 65535) throw Error("Too many parameters have been registered!");
      return this._parameterCode++;
    }

  }

  if (audioWorkletGlobalScope.AudioWorkletProcessor) {
    const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
    if (!ModuleScope.WamEventRingBuffer) ModuleScope.WamEventRingBuffer = WamEventRingBuffer2;
  }

  return WamEventRingBuffer2;
};

var WamEventRingBuffer_default = getWamEventRingBuffer; // src/addFunctionModule.js

RingBuffer_default();
WamEventRingBuffer_default();

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;

var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
  enumerable: true,
  configurable: true,
  writable: true,
  value
}) : obj[key] = value;

var __spreadValues = (a, b) => {
  for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);

  if (__getOwnPropSymbols) for (var prop of __getOwnPropSymbols(b)) {
    if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
  }
  return a;
};

var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  return value;
}; // src/CompositeAudioNode.js


var CompositeAudioNode = class extends GainNode {
  constructor() {
    super(...arguments);
    /**
     * @type {AudioNode}
     */

    __publicField(this, "_output");
    /**
     * @type {WamNode}
     */


    __publicField(this, "_wamNode");
  }

  get groupId() {
    return this.module.groupId;
  }

  get moduleId() {
    return this.module.moduleId;
  }

  get instanceId() {
    return this.module.instanceId;
  }

  get module() {
    return this._wamNode.module;
  }
  /**
   * @param {Parameters<WamNode['addEventListener']>} args
   */


  addEventListener(...args) {
    return this._wamNode.addEventListener(...args);
  }
  /**
   * @param {Parameters<WamNode['removeEventListener']>} args
   */


  removeEventListener(...args) {
    return this._wamNode.removeEventListener(...args);
  }
  /**
   * @param {Parameters<WamNode['dispatchEvent']>} args
   */


  dispatchEvent(...args) {
    return this._wamNode.dispatchEvent(...args);
  }
  /**
   * @param {Parameters<WamNode['getParameterInfo']>} args
   */


  getParameterInfo(...args) {
    return this._wamNode.getParameterInfo(...args);
  }
  /**
   * @param {Parameters<WamNode['getParameterValues']>} args
   */


  getParameterValues(...args) {
    return this._wamNode.getParameterValues(...args);
  }
  /**
   * @param {Parameters<WamNode['setParameterValues']>} args
   */


  setParameterValues(...args) {
    return this._wamNode.setParameterValues(...args);
  }

  getState() {
    return this._wamNode.getState();
  }
  /**
   * @param {Parameters<WamNode['setState']>} args
   */


  setState(...args) {
    return this._wamNode.setState(...args);
  }

  getCompensationDelay() {
    return this._wamNode.getCompensationDelay();
  }
  /**
   * @param {Parameters<WamNode['scheduleEvents']>} args
   */


  scheduleEvents(...args) {
    return this._wamNode.scheduleEvents(...args);
  }

  clearEvents() {
    return this._wamNode.clearEvents();
  }
  /**
   * @param {Parameters<WamNode['connectEvents']>} args
   */


  connectEvents(...args) {
    return this._wamNode.connectEvents(...args);
  }
  /**
   * @param {Parameters<WamNode['disconnectEvents']>} args
   */


  disconnectEvents(...args) {
    return this._wamNode.disconnectEvents(...args);
  }

  destroy() {
    return this._wamNode.destroy();
  }

  set channelCount(count) {
    if (this._output) this._output.channelCount = count;else super.channelCount = count;
  }

  get channelCount() {
    if (this._output) return this._output.channelCount;
    return super.channelCount;
  }

  set channelCountMode(mode) {
    if (this._output) this._output.channelCountMode = mode;else super.channelCountMode = mode;
  }

  get channelCountMode() {
    if (this._output) return this._output.channelCountMode;
    return super.channelCountMode;
  }

  set channelInterpretation(interpretation) {
    if (this._output) this._output.channelInterpretation = interpretation;else super.channelInterpretation = interpretation;
  }

  get channelInterpretation() {
    if (this._output) return this._output.channelInterpretation;
    return super.channelInterpretation;
  }

  get numberOfInputs() {
    return super.numberOfInputs;
  }

  get numberOfOutputs() {
    if (this._output) return this._output.numberOfOutputs;
    return super.numberOfOutputs;
  }

  get gain() {
    return void 0;
  }

  connect(...args) {
    if (this._output && this._output !== this) return this._output.connect(...args);
    return super.connect(...args);
  }

  disconnect(...args) {
    if (this._output && this._output !== this) return this._output.disconnect(...args);
    return super.disconnect(...args);
  }

}; // src/sdk/src/addFunctionModule.js

var addFunctionModule = (audioWorklet, processorFunction, ...injection) => {
  const text = `(${processorFunction.toString()})(${injection.map(s => JSON.stringify(s)).join(", ")});`;
  const url = URL.createObjectURL(new Blob([text], {
    type: "text/javascript"
  }));
  return audioWorklet.addModule(url);
};

var addFunctionModule_default = addFunctionModule; // src/ParamMgrProcessor.js

var processor = (moduleId, paramsConfig) => {
  const audioWorkletGlobalScope = globalThis;
  const {
    AudioWorkletProcessor,
    registerProcessor,
    webAudioModules
  } = audioWorkletGlobalScope;
  const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
  const supportSharedArrayBuffer = !!globalThis.SharedArrayBuffer;
  const SharedArrayBuffer = globalThis.SharedArrayBuffer || globalThis.ArrayBuffer;

  const normExp = (x, e) => e === 0 ? x : x ** 1.5 ** -e;

  const normalizeE = (x, min, max, e = 0) => min === 0 && max === 1 ? normExp(x, e) : normExp((x - min) / (max - min) || 0, e);

  const normalize = (x, min, max) => min === 0 && max === 1 ? x : (x - min) / (max - min) || 0;

  const denormalize = (x, min, max) => min === 0 && max === 1 ? x : x * (max - min) + min;

  const mapValue = (x, eMin, eMax, sMin, sMax, tMin, tMax) => denormalize(normalize(normalize(Math.min(sMax, Math.max(sMin, x)), eMin, eMax), normalize(sMin, eMin, eMax), normalize(sMax, eMin, eMax)), tMin, tMax);

  class ParamMgrProcessor extends AudioWorkletProcessor {
    static get parameterDescriptors() {
      return Object.entries(paramsConfig).map(([name, {
        defaultValue,
        minValue,
        maxValue
      }]) => ({
        name,
        defaultValue,
        minValue,
        maxValue
      }));
    }
    /**
     * @param {ParamMgrProcessorOptions} options
     */


    constructor(options) {
      super();
      this.destroyed = false;
      this.supportSharedArrayBuffer = supportSharedArrayBuffer;
      const {
        paramsMapping,
        internalParamsMinValues,
        internalParams,
        groupId,
        instanceId
      } = options.processorOptions;
      this.groupId = groupId;
      this.moduleId = moduleId;
      this.instanceId = instanceId;
      this.internalParamsMinValues = internalParamsMinValues;
      this.paramsConfig = paramsConfig;
      this.paramsMapping = paramsMapping;
      this.paramsValues = {};
      Object.entries(paramsConfig).forEach(([name, {
        defaultValue
      }]) => {
        this.paramsValues[name] = defaultValue;
      });
      this.internalParams = internalParams;
      this.internalParamsCount = this.internalParams.length;
      this.buffer = new SharedArrayBuffer((this.internalParamsCount + 1) * Float32Array.BYTES_PER_ELEMENT);
      this.$lock = new Int32Array(this.buffer, 0, 1);
      this.$internalParamsBuffer = new Float32Array(this.buffer, 4, this.internalParamsCount);
      this.eventQueue = [];
      this.handleEvent = null;
      audioWorkletGlobalScope.webAudioModules.addWam(this);
      if (!ModuleScope.paramMgrProcessors) ModuleScope.paramMgrProcessors = {};
      ModuleScope.paramMgrProcessors[this.instanceId] = this;
      this.messagePortRequestId = -1;
      const resolves = {};
      const rejects = {};

      this.call = (call, ...args) => new Promise((resolve, reject) => {
        const id = this.messagePortRequestId--;
        resolves[id] = resolve;
        rejects[id] = reject;
        this.port.postMessage({
          id,
          call,
          args
        });
      });

      this.handleMessage = ({
        data
      }) => {
        var _a, _b;

        const {
          id,
          call,
          args,
          value,
          error
        } = data;

        if (call) {
          const r = {
            id
          };

          try {
            r.value = this[call](...args);
          } catch (e) {
            r.error = e;
          }

          this.port.postMessage(r);
        } else {
          if (error) (_a = rejects[id]) == null ? void 0 : _a.call(rejects, error);else (_b = resolves[id]) == null ? void 0 : _b.call(resolves, value);
          delete resolves[id];
          delete rejects[id];
        }
      };

      this.port.start();
      this.port.addEventListener("message", this.handleMessage);
    }
    /**
     * @param {ParametersMapping} mapping
     */


    setParamsMapping(mapping) {
      this.paramsMapping = mapping;
    }

    getBuffer() {
      return {
        lock: this.$lock,
        paramsBuffer: this.$internalParamsBuffer
      };
    }

    getCompensationDelay() {
      return 128;
    }
    /**
     * @param {string[]} parameterIdQuery
     */


    getParameterInfo(...parameterIdQuery) {
      if (parameterIdQuery.length === 0) parameterIdQuery = Object.keys(this.paramsConfig);
      const parameterInfo = {};
      parameterIdQuery.forEach(parameterId => {
        parameterInfo[parameterId] = this.paramsConfig[parameterId];
      });
      return parameterInfo;
    }
    /**
     * @param {boolean} [normalized]
     * @param {string[]} parameterIdQuery
     */


    getParameterValues(normalized, ...parameterIdQuery) {
      if (parameterIdQuery.length === 0) parameterIdQuery = Object.keys(this.paramsConfig);
      const parameterValues = {};
      parameterIdQuery.forEach(parameterId => {
        if (!(parameterId in this.paramsValues)) return;
        const {
          minValue,
          maxValue,
          exponent
        } = this.paramsConfig[parameterId];
        const value = this.paramsValues[parameterId];
        parameterValues[parameterId] = {
          id: parameterId,
          value: normalized ? normalizeE(value, minValue, maxValue, exponent) : value,
          normalized
        };
      });
      return parameterValues;
    }
    /**
     * @param {WamEvent[]} events
     */


    scheduleEvents(...events) {
      this.eventQueue.push(...events);
      const {
        currentTime
      } = audioWorkletGlobalScope;
      this.eventQueue.sort((a, b) => (a.time || currentTime) - (b.time || currentTime));
    }
    /**
     * @param {WamEvent[]} events
     */


    emitEvents(...events) {
      webAudioModules.emitEvents(this, ...events);
    }

    clearEvents() {
      this.eventQueue = [];
    }

    lock() {
      if (globalThis.Atomics) Atomics.store(this.$lock, 0, 1);
    }

    unlock() {
      if (globalThis.Atomics) Atomics.store(this.$lock, 0, 0);
    }
    /**
     * Main process
     *
     * @param {Float32Array[][]} inputs
     * @param {Float32Array[][]} outputs
     * @param {Record<string, Float32Array>} parameters
     */


    process(inputs, outputs, parameters) {
      if (this.destroyed) return false;
      const outputOffset = 1;
      this.lock();
      Object.entries(this.paramsConfig).forEach(([name, {
        minValue,
        maxValue
      }]) => {
        const raw = parameters[name];
        if (name in this.paramsValues) this.paramsValues[name] = raw[raw.length - 1];
        if (!this.paramsMapping[name]) return;
        Object.entries(this.paramsMapping[name]).forEach(([targetName, targetMapping]) => {
          var _a, _b;

          const j = this.internalParams.indexOf(targetName);
          if (j === -1) return;
          const intrinsicValue = this.internalParamsMinValues[j];
          const {
            sourceRange,
            targetRange
          } = targetMapping;
          const [sMin, sMax] = sourceRange;
          const [tMin, tMax] = targetRange;
          let out;

          if (minValue !== tMin || maxValue !== tMax || minValue !== sMin || maxValue !== sMax) {
            out = raw.map(v => {
              const mappedValue = mapValue(v, minValue, maxValue, sMin, sMax, tMin, tMax);
              return mappedValue - intrinsicValue;
            });
          } else if (intrinsicValue) {
            out = raw.map(v => v - intrinsicValue);
          } else {
            out = raw;
          }

          if (out.length === 1) (_a = outputs[j + outputOffset][0]) == null ? void 0 : _a.fill(out[0]);else (_b = outputs[j + outputOffset][0]) == null ? void 0 : _b.set(out);
          this.$internalParamsBuffer[j] = out[0];
        });
      });
      this.unlock();

      if (!this.supportSharedArrayBuffer) {
        this.call("setBuffer", {
          lock: this.$lock,
          paramsBuffer: this.$internalParamsBuffer
        });
      }

      const {
        currentTime
      } = audioWorkletGlobalScope;
      let $event;

      for ($event = 0; $event < this.eventQueue.length; $event++) {
        const event = this.eventQueue[$event];
        if (event.time && event.time > currentTime) break;
        if (typeof this.handleEvent === "function") this.handleEvent(event);
        this.call("dispatchWamEvent", event);
      }

      if ($event) this.eventQueue.splice(0, $event);
      return true;
    }
    /**
     * @param {string} wamInstanceId
     * @param {number} [output]
     */


    connectEvents(wamInstanceId, output) {
      webAudioModules.connectEvents(this.groupId, this.instanceId, wamInstanceId, output);
    }
    /**
     * @param {string} [wamInstanceId]
     * @param {number} [output]
     */


    disconnectEvents(wamInstanceId, output) {
      if (typeof wamInstanceId === "undefined") {
        webAudioModules.disconnectEvents(this.groupId, this.instanceId);
        return;
      }

      webAudioModules.disconnectEvents(this.groupId, this.instanceId, wamInstanceId, output);
    }

    destroy() {
      audioWorkletGlobalScope.webAudioModules.removeWam(this);
      if (ModuleScope.paramMgrProcessors) delete ModuleScope.paramMgrProcessors[this.instanceId];
      this.destroyed = true;
      this.port.close();
    }

  }

  try {
    registerProcessor(moduleId, ParamMgrProcessor);
  } catch (error) {
    console.warn(error);
  }
};

var ParamMgrProcessor_default = processor; // src/sdk/src/WamParameterInfo.js

var getWamParameterInfo = moduleId => {
  const audioWorkletGlobalScope = globalThis;

  const normExp = (x, e) => e === 0 ? x : x ** 1.5 ** -e;

  const denormExp = (x, e) => e === 0 ? x : x ** 1.5 ** e;

  const normalize = (x, min, max, e = 0) => min === 0 && max === 1 ? normExp(x, e) : normExp((x - min) / (max - min) || 0, e);

  const denormalize = (x, min, max, e = 0) => min === 0 && max === 1 ? denormExp(x, e) : denormExp(x, e) * (max - min) + min;

  const inRange = (x, min, max) => x >= min && x <= max;

  class WamParameterInfo2 {
    /**
     * @param {string} id
     * @param {WamParameterConfiguration} [config]
     */
    constructor(id, config = {}) {
      let {
        type,
        label,
        defaultValue,
        minValue,
        maxValue,
        discreteStep,
        exponent,
        choices,
        units
      } = config;
      if (type === void 0) type = "float";
      if (label === void 0) label = "";
      if (defaultValue === void 0) defaultValue = 0;
      if (choices === void 0) choices = [];

      if (type === "boolean" || type === "choice") {
        discreteStep = 1;
        minValue = 0;
        if (choices.length) maxValue = choices.length - 1;else maxValue = 1;
      } else {
        if (minValue === void 0) minValue = 0;
        if (maxValue === void 0) maxValue = 1;
        if (discreteStep === void 0) discreteStep = 0;
        if (exponent === void 0) exponent = 0;
        if (units === void 0) units = "";
      }

      const errBase = `Param config error | ${id}: `;
      if (minValue >= maxValue) throw Error(errBase.concat("minValue must be less than maxValue"));
      if (!inRange(defaultValue, minValue, maxValue)) throw Error(errBase.concat("defaultValue out of range"));

      if (discreteStep % 1 || discreteStep < 0) {
        throw Error(errBase.concat("discreteStep must be a non-negative integer"));
      } else if (discreteStep > 0 && (minValue % 1 || maxValue % 1 || defaultValue % 1)) {
        throw Error(errBase.concat("non-zero discreteStep requires integer minValue, maxValue, and defaultValue"));
      }

      if (type === "choice" && !choices.length) {
        throw Error(errBase.concat("choice type parameter requires list of strings in choices"));
      }

      this.id = id;
      this.label = label;
      this.type = type;
      this.defaultValue = defaultValue;
      this.minValue = minValue;
      this.maxValue = maxValue;
      this.discreteStep = discreteStep;
      this.exponent = exponent;
      this.choices = choices;
      this.units = units;
    }
    /**
     * Convert a value from the parameter's denormalized range
     * `[minValue, maxValue]` to normalized range `[0, 1]`.
     * @param {number} value
     */


    normalize(value) {
      return normalize(value, this.minValue, this.maxValue, this.exponent);
    }
    /**
     * Convert a value from normalized range `[0, 1]` to the
     * parameter's denormalized range `[minValue, maxValue]`.
     * @param {number} valueNorm
     */


    denormalize(valueNorm) {
      return denormalize(valueNorm, this.minValue, this.maxValue, this.exponent);
    }
    /**
     * Get a human-readable string representing the given value,
     * including units if applicable.
     * @param {number} value
     */


    valueString(value) {
      if (this.choices) return this.choices[value];
      if (this.units !== "") return `${value} ${this.units}`;
      return `${value}`;
    }

  }

  if (audioWorkletGlobalScope.AudioWorkletProcessor) {
    const ModuleScope = audioWorkletGlobalScope.webAudioModules.getModuleScope(moduleId);
    if (!ModuleScope.WamParameterInfo) ModuleScope.WamParameterInfo = WamParameterInfo2;
  }

  return WamParameterInfo2;
};

var WamParameterInfo_default = getWamParameterInfo; // src/ParamConfigurator.js

var WamParameterInfo = WamParameterInfo_default();
var ParamMappingConfigurator = class {
  /**
   * @param {ParametersMappingConfiguratorOptions} [options = {}]
   */
  constructor(options = {}) {
    /**
     * @private
     * @type {Record<string, WamParameterConfiguration>}
     */
    __publicField(this, "_paramsConfig");
    /**
     * @private
     * @type {InternalParametersDescriptor}
     */


    __publicField(this, "_internalParamsConfig");
    /**
     * @private
     * @type {ParametersMapping}
     */


    __publicField(this, "_paramsMapping", {});

    const {
      paramsConfig,
      paramsMapping,
      internalParamsConfig
    } = options;
    this._paramsConfig = paramsConfig;
    this._paramsMapping = paramsMapping;
    this._internalParamsConfig = internalParamsConfig;
  }
  /**
   * Auto-completed `paramsConfig`:
   *
   * if no `paramsConfig` is defined while initializing, this will be be filled from the internalParamsConfig;
   *
   * if a parameter is not fully configured, the incompleted properties will have the same value as in the internalParamsConfig.
   *
   * @type {WamParameterInfoMap}
   */


  get paramsConfig() {
    const {
      internalParamsConfig
    } = this;
    return Object.entries(this._paramsConfig || internalParamsConfig).reduce((configs, [id, config]) => {
      var _a, _b, _c, _d;

      const internalParam = internalParamsConfig[id];
      configs[id] = new WamParameterInfo(id, __spreadProps(__spreadValues({}, config), {
        label: (_a = config.label) != null ? _a : id,
        defaultValue: (_b = config.defaultValue) != null ? _b : internalParam == null ? void 0 : internalParam.defaultValue,
        minValue: (_c = config.minValue) != null ? _c : internalParam == null ? void 0 : internalParam.minValue,
        maxValue: (_d = config.maxValue) != null ? _d : internalParam == null ? void 0 : internalParam.maxValue
      }));
      return configs;
    }, {});
  }
  /**
   * Auto-completed configuration of the `internalParamsConfig`
   *
   * Internal Parameters Config contains all the automatable parameters' information.
   *
   * An automatable parameter could be a `WebAudio` `AudioParam`
   * or a config with an `onChange` callback that will be called while the value has been changed.
   *
   * @type {InternalParametersDescriptor}
   */


  get internalParamsConfig() {
    return Object.entries(this._internalParamsConfig || {}).reduce((configs, [name, config]) => {
      if (config instanceof AudioParam) configs[name] = config;else {
        const defaultConfig = {
          minValue: 0,
          maxValue: 1,
          defaultValue: 0,
          automationRate: 30
        };
        configs[name] = __spreadValues(__spreadValues({}, defaultConfig), config);
      }
      return configs;
    }, {});
  }
  /**
   * Auto-completed `paramsMapping`,
   * the mapping can be omitted while initialized,
   * but is useful when an exposed param (in the `paramsConfig`) should automate
   * several internal params (in the `internalParamsConfig`) or has a different range there.
   *
   * If a parameter is present in both `paramsConfig` and `internalParamsConfig` (or the `paramsConfig` is not configured),
   * a map of this parameter will be there automatically, if not declared explicitly.
   *
   * @type {ParametersMapping}
   */


  get paramsMapping() {
    const declared = this._paramsMapping || {};
    const externalParams = this.paramsConfig;
    const internalParams = this.internalParamsConfig;
    return Object.entries(externalParams).reduce((mapping, [name, {
      minValue,
      maxValue
    }]) => {
      const sourceRange = [minValue, maxValue];
      const defaultMapping = {
        sourceRange,
        targetRange: [...sourceRange]
      };

      if (declared[name]) {
        const declaredTargets = Object.entries(declared[name]).reduce((targets, [targetName, targetMapping]) => {
          if (internalParams[targetName]) {
            targets[targetName] = __spreadValues(__spreadValues({}, defaultMapping), targetMapping);
          }

          return targets;
        }, {});
        mapping[name] = declaredTargets;
      } else if (internalParams[name]) {
        mapping[name] = {
          [name]: __spreadValues({}, defaultMapping)
        };
      }

      return mapping;
    }, {});
  }

}; // src/MgrAudioParam.js

var MgrAudioParam = class extends AudioParam {
  constructor() {
    super(...arguments);
    /**
     * @type {WamParameterInfo}
     */

    __publicField(this, "_info");
  }

  get exponent() {
    return this.info.exponent;
  }

  get info() {
    return this._info;
  }

  set info(info) {
    this._info = info;
  }

  set normalizedValue(valueIn) {
    this.value = this.info.denormalize(valueIn);
  }

  get normalizedValue() {
    return this.info.normalize(this.value);
  }

  setValueAtTime(value, startTime) {
    return super.setValueAtTime(value, startTime);
  }

  setNormalizedValueAtTime(valueIn, startTime) {
    const value = this.info.denormalize(valueIn);
    return this.setValueAtTime(value, startTime);
  }

  linearRampToValueAtTime(value, endTime) {
    return super.linearRampToValueAtTime(value, endTime);
  }

  linearRampToNormalizedValueAtTime(valueIn, endTime) {
    const value = this.info.denormalize(valueIn);
    return this.linearRampToValueAtTime(value, endTime);
  }

  exponentialRampToValueAtTime(value, endTime) {
    return super.exponentialRampToValueAtTime(value, endTime);
  }

  exponentialRampToNormalizedValueAtTime(valueIn, endTime) {
    const value = this.info.denormalize(valueIn);
    return this.exponentialRampToValueAtTime(value, endTime);
  }

  setTargetAtTime(target, startTime, timeConstant) {
    return super.setTargetAtTime(target, startTime, timeConstant);
  }

  setNormalizedTargetAtTime(targetIn, startTime, timeConstant) {
    const target = this.info.denormalize(targetIn);
    return this.setTargetAtTime(target, startTime, timeConstant);
  }

  setValueCurveAtTime(values, startTime, duration) {
    return super.setValueCurveAtTime(values, startTime, duration);
  }

  setNormalizedValueCurveAtTime(valuesIn, startTime, duration) {
    const values = Array.from(valuesIn).map(v => this.info.denormalize(v));
    return this.setValueCurveAtTime(values, startTime, duration);
  }

  cancelScheduledParamValues(cancelTime) {
    return super.cancelScheduledValues(cancelTime);
  }

  cancelAndHoldParamAtTime(cancelTime) {
    return super.cancelAndHoldAtTime(cancelTime);
  }

}; // src/ParamMgrNode.js

var AudioWorkletNode = globalThis.AudioWorkletNode;
var ParamMgrNode = class extends AudioWorkletNode {
  /**
      * @param {WebAudioModule} module
      * @param {ParamMgrOptions} options
      */
  constructor(module, options) {
    super(module.audioContext, module.moduleId, {
      numberOfInputs: 0,
      numberOfOutputs: 1 + options.processorOptions.internalParams.length,
      parameterData: options.parameterData,
      processorOptions: options.processorOptions
    });
    /**
     * @param {string} name
     */

    __publicField(this, "requestDispatchIParamChange", name => {
      const config = this.internalParamsConfig[name];
      if (!("onChange" in config)) return;
      const {
        automationRate,
        onChange
      } = config;
      if (typeof automationRate !== "number" || !automationRate) return;
      const interval = 1e3 / automationRate;
      const i = this.internalParams.indexOf(name);
      if (i === -1) return;
      if (i >= this.internalParams.length) return;

      if (typeof this.paramsUpdateCheckFnRef[i] === "number") {
        window.clearTimeout(this.paramsUpdateCheckFnRef[i]);
      }

      this.paramsUpdateCheckFn[i] = () => {
        const prev = this.$prevParamsBuffer[i];
        const cur = this.$paramsBuffer[i];

        if (cur !== prev) {
          onChange(cur, prev);
          this.$prevParamsBuffer[i] = cur;
        }

        this.paramsUpdateCheckFnRef[i] = window.setTimeout(this.paramsUpdateCheckFn[i], interval);
      };

      this.paramsUpdateCheckFn[i]();
    });

    const {
      processorOptions,
      internalParamsConfig
    } = options;
    this.initialized = false;
    this.module = module;
    this.instanceId = options.processorOptions.instanceId;
    this.groupId = options.processorOptions.groupId;
    this.paramsConfig = processorOptions.paramsConfig;
    this.internalParams = processorOptions.internalParams;
    this.internalParamsConfig = internalParamsConfig;
    this.$prevParamsBuffer = new Float32Array(this.internalParams.length);
    this.paramsUpdateCheckFn = [];
    this.paramsUpdateCheckFnRef = [];
    this.messageRequestId = 0;
    this.dummyGainNode = module.audioContext.createGain();
    Object.entries(this.getParams()).forEach(([name, param]) => {
      Object.setPrototypeOf(param, MgrAudioParam.prototype);
      param._info = this.paramsConfig[name];
    });
    const resolves = {};
    const rejects = {};

    this.call = (call, ...args) => {
      const id = this.messageRequestId;
      this.messageRequestId += 1;
      return new Promise((resolve, reject) => {
        resolves[id] = resolve;
        rejects[id] = reject;
        this.port.postMessage({
          id,
          call,
          args
        });
      });
    };

    this.handleMessage = ({
      data
    }) => {
      var _a, _b;

      const {
        id,
        call,
        args,
        value,
        error
      } = data;

      if (call) {
        const r = {
          id
        };

        try {
          r.value = this[call](...args);
        } catch (e) {
          r.error = e;
        }

        this.port.postMessage(r);
      } else {
        if (error) (_a = rejects[id]) == null ? void 0 : _a.call(rejects, error);else (_b = resolves[id]) == null ? void 0 : _b.call(resolves, value);
        delete resolves[id];
        delete rejects[id];
      }
    };

    this.port.start();
    this.port.addEventListener("message", this.handleMessage);
  }
  /**
   * @returns {ReadonlyMap<string, MgrAudioParam>}
   */


  get parameters() {
    return super.parameters;
  }

  get moduleId() {
    return this.module.moduleId;
  }

  async initialize() {
    const response = await this.call("getBuffer");
    const {
      lock,
      paramsBuffer
    } = response;
    this.$lock = lock;
    this.$paramsBuffer = paramsBuffer;
    const offset = 1;
    Object.entries(this.internalParamsConfig).forEach(([name, config], i) => {
      if (this.context.state === "suspended") this.$paramsBuffer[i] = config.defaultValue;

      if (config instanceof AudioParam) {
        try {
          config.automationRate = "a-rate";
        } catch (e) {} finally {
          config.value = Math.max(0, config.minValue);
          this.connect(config, offset + i);
          this.connect(this.dummyGainNode, offset + i, 0);
        }
      } else if (config instanceof AudioNode) {
        this.connect(config, offset + i);
      } else {
        this.requestDispatchIParamChange(name);
      }
    });
    this.connect(this.module.audioContext.destination, 0, 0);
    this.initialized = true;
    return this;
  }
  /**
   * @param {ReturnType<ParamMgrCallToProcessor['getBuffer']>} buffer
   */


  setBuffer({
    lock,
    paramsBuffer
  }) {
    this.$lock = lock;
    this.$paramsBuffer = paramsBuffer;
  }

  setParamsMapping(paramsMapping) {
    return this.call("setParamsMapping", paramsMapping);
  }

  getCompensationDelay() {
    return this.call("getCompensationDelay");
  }

  getParameterInfo(...parameterIdQuery) {
    return this.call("getParameterInfo", ...parameterIdQuery);
  }

  getParameterValues(normalized, ...parameterIdQuery) {
    return this.call("getParameterValues", normalized, ...parameterIdQuery);
  }
  /**
   * @param {WamAutomationEvent} event
   */


  scheduleAutomation(event) {
    const time = event.time || this.context.currentTime;
    const {
      id,
      normalized,
      value
    } = event.data;
    const audioParam = this.getParam(id);
    if (!audioParam) return;

    if (audioParam.info.type === "float") {
      if (normalized) audioParam.linearRampToNormalizedValueAtTime(value, time);else audioParam.linearRampToValueAtTime(value, time);
    } else {
      if (normalized) audioParam.setNormalizedValueAtTime(value, time);else audioParam.setValueAtTime(value, time);
    }
  }
  /**
   * @param {WamEvent[]} events
   */


  scheduleEvents(...events) {
    events.forEach(event => {
      if (event.type === "wam-automation") {
        this.scheduleAutomation(event);
      }
    });
    this.call("scheduleEvents", ...events);
  }
  /**
   * @param {WamEvent[]} events
   */


  emitEvents(...events) {
    this.call("emitEvents", ...events);
  }

  clearEvents() {
    this.call("clearEvents");
  }
  /**
   * @param {WamEvent} event
   */


  dispatchWamEvent(event) {
    if (event.type === "wam-automation") {
      this.scheduleAutomation(event);
    } else {
      this.dispatchEvent(new CustomEvent(event.type, {
        detail: event
      }));
    }
  }
  /**
   * @param {WamParameterValueMap} parameterValues
   */


  async setParameterValues(parameterValues) {
    Object.keys(parameterValues).forEach(parameterId => {
      const parameterUpdate = parameterValues[parameterId];
      const parameter = this.parameters.get(parameterId);
      if (!parameter) return;
      if (!parameterUpdate.normalized) parameter.value = parameterUpdate.value;else parameter.normalizedValue = parameterUpdate.value;
    });
  }

  async getState() {
    return this.getParamsValues();
  }

  async setState(state) {
    this.setParamsValues(state);
  }

  convertTimeToFrame(time) {
    return Math.round(time * this.context.sampleRate);
  }

  convertFrameToTime(frame) {
    return frame / this.context.sampleRate;
  }
  /**
   * @param {string} name
   */


  getIParamIndex(name) {
    const i = this.internalParams.indexOf(name);
    return i === -1 ? null : i;
  }
  /**
   * @param {string} name
   * @param {AudioParam | AudioNode} dest
   * @param {number} index
   */


  connectIParam(name, dest, index) {
    const offset = 1;
    const i = this.getIParamIndex(name);

    if (i !== null) {
      if (dest instanceof AudioNode) {
        if (typeof index === "number") this.connect(dest, offset + i, index);else this.connect(dest, offset + i);
      } else {
        this.connect(dest, offset + i);
      }
    }
  }
  /**
   * @param {string} name
   * @param {AudioParam | AudioNode} dest
   * @param {number} index
   */


  disconnectIParam(name, dest, index) {
    const offset = 1;
    const i = this.getIParamIndex(name);

    if (i !== null) {
      if (dest instanceof AudioNode) {
        if (typeof index === "number") this.disconnect(dest, offset + i, index);else this.disconnect(dest, offset + i);
      } else {
        this.disconnect(dest, offset + i);
      }
    }
  }

  getIParamValue(name) {
    const i = this.getIParamIndex(name);
    return i !== null ? this.$paramsBuffer[i] : null;
  }

  getIParamsValues() {
    const values = {};
    this.internalParams.forEach((name, i) => {
      values[name] = this.$paramsBuffer[i];
    });
    return values;
  }

  getParam(name) {
    return this.parameters.get(name) || null;
  }

  getParams() {
    return Object.fromEntries(this.parameters);
  }

  getParamValue(name) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.value;
  }

  setParamValue(name, value) {
    const param = this.parameters.get(name);
    if (!param) return;
    param.value = value;
  }

  getParamsValues() {
    const values = {};
    this.parameters.forEach((v, k) => {
      values[k] = v.value;
    });
    return values;
  }
  /**
   * @param {Record<string, number>} values
   */


  setParamsValues(values) {
    if (!values) return;
    Object.entries(values).forEach(([k, v]) => {
      this.setParamValue(k, v);
    });
  }

  getNormalizedParamValue(name) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.normalizedValue;
  }

  setNormalizedParamValue(name, value) {
    const param = this.parameters.get(name);
    if (!param) return;
    param.normalizedValue = value;
  }

  getNormalizedParamsValues() {
    const values = {};
    this.parameters.forEach((v, k) => {
      values[k] = this.getNormalizedParamValue(k);
    });
    return values;
  }

  setNormalizedParamsValues(values) {
    if (!values) return;
    Object.entries(values).forEach(([k, v]) => {
      this.setNormalizedParamValue(k, v);
    });
  }

  setParamValueAtTime(name, value, startTime) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.setValueAtTime(value, startTime);
  }

  setNormalizedParamValueAtTime(name, value, startTime) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.setNormalizedValueAtTime(value, startTime);
  }

  linearRampToParamValueAtTime(name, value, endTime) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.linearRampToValueAtTime(value, endTime);
  }

  linearRampToNormalizedParamValueAtTime(name, value, endTime) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.linearRampToNormalizedValueAtTime(value, endTime);
  }

  exponentialRampToParamValueAtTime(name, value, endTime) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.exponentialRampToValueAtTime(value, endTime);
  }

  exponentialRampToNormalizedParamValueAtTime(name, value, endTime) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.exponentialRampToNormalizedValueAtTime(value, endTime);
  }

  setParamTargetAtTime(name, target, startTime, timeConstant) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.setTargetAtTime(target, startTime, timeConstant);
  }

  setNormalizedParamTargetAtTime(name, target, startTime, timeConstant) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.setNormalizedTargetAtTime(target, startTime, timeConstant);
  }

  setParamValueCurveAtTime(name, values, startTime, duration) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.setValueCurveAtTime(values, startTime, duration);
  }

  setNormalizedParamValueCurveAtTime(name, values, startTime, duration) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.setNormalizedValueCurveAtTime(values, startTime, duration);
  }

  cancelScheduledParamValues(name, cancelTime) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.cancelScheduledValues(cancelTime);
  }

  cancelAndHoldParamAtTime(name, cancelTime) {
    const param = this.parameters.get(name);
    if (!param) return null;
    return param.cancelAndHoldAtTime(cancelTime);
  }
  /**
   * @param {string} toId
   * @param {number} [output]
   */


  connectEvents(toId, output) {
    this.call("connectEvents", toId, output);
  }
  /**
   * @param {string} [toId]
   * @param {number} [output]
   */


  disconnectEvents(toId, output) {
    this.call("disconnectEvents", toId, output);
  }

  async destroy() {
    this.disconnect();
    this.paramsUpdateCheckFnRef.forEach(ref => {
      if (typeof ref === "number") window.clearTimeout(ref);
    });
    await this.call("destroy");
    this.port.close();
  }

}; // src/ParamMgrFactory.js

var ParamMgrFactory = class {
  /**
   * @param {WebAudioModule} module
   * @param {ParametersMappingConfiguratorOptions} [optionsIn = {}]
   */
  static async create(module, optionsIn = {}) {
    const {
      audioContext,
      moduleId
    } = module;
    const instanceId = optionsIn.instanceId || module.instanceId;
    const groupId = optionsIn.groupId || module.groupId;
    const {
      paramsConfig,
      paramsMapping,
      internalParamsConfig
    } = new ParamMappingConfigurator(optionsIn);
    const initialParamsValue = Object.entries(paramsConfig).reduce((currentParams, [name, {
      defaultValue
    }]) => {
      currentParams[name] = defaultValue;
      return currentParams;
    }, {});
    const serializableParamsConfig = Object.entries(paramsConfig).reduce((currentParams, [name, {
      id,
      label,
      type,
      defaultValue,
      minValue,
      maxValue,
      discreteStep,
      exponent,
      choices,
      units
    }]) => {
      currentParams[name] = {
        id,
        label,
        type,
        defaultValue,
        minValue,
        maxValue,
        discreteStep,
        exponent,
        choices,
        units
      };
      return currentParams;
    }, {});
    await addFunctionModule_default(audioContext.audioWorklet, ParamMgrProcessor_default, moduleId, serializableParamsConfig);
    const options = {
      internalParamsConfig,
      parameterData: initialParamsValue,
      processorOptions: {
        paramsConfig,
        paramsMapping,
        internalParamsMinValues: Object.values(internalParamsConfig).map(config => Math.max(0, (config == null ? void 0 : config.minValue) || 0)),
        internalParams: Object.keys(internalParamsConfig),
        groupId,
        instanceId,
        moduleId
      }
    };
    const node = new ParamMgrNode(module, options);
    await node.initialize();
    return node;
  }

};

function constantSource(audioContext) {
  if (audioContext.createConstantSource) {
    let source = audioContext.createConstantSource();
    source.start();
    return source;
  } else {
    // Implementation 1: works, probably more costly?
    // let osc = audioContext.createOscillator();
    // osc.waveform = "square"
    // osc.start();
    // let shaper = audioContext.createWaveShaper()
    // var curve = new Float32Array(2);
    // curve[0] = 1.0;
    // curve[1] = 1.0;
    // shaper.curve = curve;
    // osc.connect(shaper);
    // return shaper;
    // implementation 2: sample playback of 1.0 samples - works
    let length = audioContext.sampleRate;
    var buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
    var noise = buffer.getChannelData(0);

    for (var i = 0; i < length; i++) {
      noise[i] = 1.0;
    }

    var source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.loopStart = 0.0;
    source.loopEnd = 0.9;
    source.start();
    return source;
  }
}
function noiseSource(audioContext) {
  let length = audioContext.sampleRate;
  var buffer = audioContext.createBuffer(1, length, audioContext.sampleRate);
  var noise = buffer.getChannelData(0);

  for (var i = 0; i < length; i++) {
    noise[i] = Math.random() * 2 - 1;
  }

  var source = audioContext.createBufferSource();
  source.buffer = buffer;
  source.loop = true;
  source.loopStart = 0.0;
  source.loopEnd = 0.9;
  source.start();
  return source;
}

const shaperLength = 44100;
class MIDI {}

_defineProperty(MIDI, "NOTE_ON", 0x90);

_defineProperty(MIDI, "NOTE_OFF", 0x80);

_defineProperty(MIDI, "CC", 0xB0);

let lfoWaves$2 = ["triangle", "square"]; // name is not so important here, the file Node.js is imported
// Normally the class does no need to be exported as
// an async mehod createNode is expored at the end of this
// file.

class Synth101Node extends CompositeAudioNode {
  /**
   * @type {ParamMgrNode<Params, InternalParams>}
   */
  get paramMgr() {
    return this._wamNode;
  } // plugin is an instance of he class that exends WebAudioModule
  // this instance is he plugin as an Observable
  // options is an extra container that could be ussed to indicate
  // the number of inputs and outputs...


  constructor(audioContext) {
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    super(audioContext, options);

    _defineProperty(this, "_wamNode", undefined);

    _defineProperty(this, "isEnabled", true);

    _defineProperty(this, "heldNotes", void 0);

    _defineProperty(this, "currentNote", void 0);

    _defineProperty(this, "parameters", {
      waveform: 0,
      detune: 0,
      lfoRate: 0,
      lfoWaveform: 0,
      oscMod: 0,
      oscRange: 0,
      pulseWidth: 0,
      pwmSource: 0,
      subRange: 0,
      mixerPulse: 0,
      mixerSaw: 1,
      mixerNoise: 0,
      mixerSub: 0.2,
      filterFreq: 0.35,
      filterRes: 0,
      filterEnv: 0.3,
      filterKeyboard: 0,
      filterMod: 0,
      vcaSource: 0,
      envTrigger: 0,
      envAttack: 0,
      envDecay: 0.1,
      envSustain: 0,
      envRelease: 0,
      portamentoMode: 0,
      portamentoTime: 0
    });

    _defineProperty(this, "oscillator", void 0);

    _defineProperty(this, "pulseGain", void 0);

    _defineProperty(this, "pulseShaper", void 0);

    _defineProperty(this, "subOsc", void 0);

    _defineProperty(this, "lfo", void 0);

    _defineProperty(this, "lfoPWM", void 0);

    _defineProperty(this, "lfoFilter", void 0);

    _defineProperty(this, "lfoOscMod", void 0);

    _defineProperty(this, "envSource", void 0);

    _defineProperty(this, "env", void 0);

    _defineProperty(this, "envFilter", void 0);

    _defineProperty(this, "envVCA", void 0);

    _defineProperty(this, "envPWM", void 0);

    _defineProperty(this, "kybdSource", void 0);

    _defineProperty(this, "kybdGain", void 0);

    _defineProperty(this, "filters", void 0);

    _defineProperty(this, "mixerSaw", void 0);

    _defineProperty(this, "mixerPulse", void 0);

    _defineProperty(this, "mixerSub", void 0);

    _defineProperty(this, "mixerNoise", void 0);

    _defineProperty(this, "vca", void 0);

    _defineProperty(this, "stereoOut", void 0);

    _defineProperty(this, "targetFreq", void 0);

    console.log("Synth101 constructor()"); // internal note-holding state

    this.heldNotes = [];
    this.heldNotes.length = 128;
    this.heldNotes.fill(false, 0, 128);
    this.targetFreq = 0;
    this.currentNote = -1;
    this.createNodes();
  }

  setup(paramMgr) {
    paramMgr.addEventListener('wam-midi', e => this.processMIDIEvents([{
      event: e.detail.data.bytes,
      time: 0
    }]));
    this._wamNode = paramMgr;
    this.connectNodes();
  }

  set status(_sig) {
    this.isEnabled = _sig;
  }

  /*  #########  Personnal code for the web audio graph  #########   */
  createNodes() {
    // do I need to call super.connect even though I'm not an audio effect with an input?
    //		super.connect(this._input);
    this.oscillator = this.context.createOscillator();
    this.oscillator.type = "sawtooth";
    this.pulseGain = this.context.createGain();
    this.pulseShaper = this.context.createWaveShaper();
    var curve = new Float32Array(shaperLength);
    let quarter = shaperLength / 4;

    for (var i = 0; i < shaperLength; i++) {
      if (i < quarter) {
        curve[i] = -1.0;
      } else if (i > quarter * 3) {
        curve[i] = -1.0;
      } else {
        curve[i] = 1.0;
      }
    }

    this.pulseShaper.curve = curve; // subosc

    this.subOsc = this.context.createOscillator();
    this.subOsc.type = "square"; // Modulators (LFO/Env)

    this.lfo = this.context.createOscillator();
    this.lfo.type = "triangle";
    this.lfoPWM = this.context.createGain();
    this.lfoFilter = this.context.createGain();
    this.lfoOscMod = this.context.createGain();
    this.lfo.connect(this.lfoPWM);
    this.lfo.connect(this.lfoOscMod);
    this.lfo.connect(this.lfoFilter);
    this.lfoOscMod.connect(this.oscillator.detune);
    this.lfoOscMod.connect(this.subOsc.detune);
    this.envSource = constantSource(this.context);
    this.env = this.context.createGain();
    this.envFilter = this.context.createGain();
    this.envVCA = this.context.createGain();
    this.envPWM = this.context.createGain();
    this.kybdSource = constantSource(this.context);
    this.kybdGain = this.context.createGain();
    this.kybdSource.connect(this.kybdGain);
    this.filters = [this.context.createBiquadFilter(), this.context.createBiquadFilter(), this.context.createBiquadFilter()];
    this.filters.forEach(filter => {
      filter.type = "lowpass";
      this.lfoFilter.connect(filter.detune);
      this.envFilter.connect(filter.detune);
      this.kybdGain.connect(filter.detune);
    });
    this.mixerSaw = this.context.createGain();
    this.mixerPulse = this.context.createGain();
    this.mixerSub = this.context.createGain();
    this.mixerNoise = this.context.createGain();
    this.vca = this.context.createGain();
    this.vca.gain.setValueAtTime(0, 0);
    this.oscillator.start(0);
    this.lfo.start(0);
    this.subOsc.start(0); // saw -> mixer

    this.oscillator.connect(this.mixerSaw);
    this.mixerSaw.connect(this.filters[0]); // generate pulse -> mixer

    this.lfoPWM.connect(this.pulseGain.gain);
    this.envPWM.connect(this.pulseGain.gain);
    this.oscillator.connect(this.pulseGain);
    this.pulseGain.connect(this.pulseShaper);
    this.pulseShaper.connect(this.mixerPulse);
    this.mixerPulse.connect(this.filters[0]); // sub -> mixer

    this.subOsc.connect(this.mixerSub);
    this.mixerSub.connect(this.filters[0]);
    this.filters[0].connect(this.filters[1]);
    this.filters[1].connect(this.filters[2]);
    this.filters[2].connect(this.vca); // noise -> mixer

    let noise = noiseSource(this.context);
    noise.connect(this.mixerNoise);
    this.mixerNoise.connect(this.filters[0]); // env

    this.envSource.connect(this.env);
    this.env.connect(this.envFilter);
    this.env.connect(this.envVCA);
    this.env.connect(this.envPWM); //this.envVCA.connect(this.vca.gain);

    this._output = this.context.createChannelMerger(2);
    this.vca.connect(this._output, 0, 0);
    this.vca.connect(this._output, 0, 1);
    this.updateFromState();
  }

  connectNodes() {// do we need to connect in connectNodes?  currently connecting in createNodes above..
  } // MIDI note handling


  processMIDIEvents(midiEvents) {
    midiEvents.forEach(message => {
      if (message.event[0] == MIDI.NOTE_ON) {
        let midiNote = message.event[1];
        let velocity = message.event[2];
        if (velocity) this.noteOn(midiNote, message.time);else this.noteOff(midiNote, message.time);
      } else if (message.event[0] == MIDI.NOTE_OFF) {
        let midiNote = message.event[1];
        this.noteOff(midiNote, message.time);
      }
    });
  }

  noteOn(note, tickStartTime) {
    this.heldNotes[note] = true;
    this.noteUpdate(tickStartTime);
  }

  noteOff(note, tickStartTime) {
    this.heldNotes[note] = false;
    this.noteUpdate(tickStartTime);
  }

  allNotesOff(tickStartTime) {
    this.heldNotes.fill(false, 0, 128);
    this.noteUpdate(tickStartTime);
  }

  setPitch(note, tickStartTime, portamento) {
    // note 69 = freq 440
    // every 12 notes, double freq
    let rangeMultiples = [0.5, 1, 2, 4];
    this.targetFreq = 440 * Math.pow(2, (note - 69) / 12) * rangeMultiples[this.parameters.oscRange];
    let time = portamento ? this.parameters.portamentoTime / 5 : 0;
    this.oscillator.frequency.setTargetAtTime(this.targetFreq, tickStartTime, time);
    this.subOsc.frequency.setTargetAtTime(this.targetFreq, tickStartTime, time); // set kybd

    this.kybdGain.gain.setTargetAtTime((note - 69) * 100 * this.parameters.filterKeyboard, tickStartTime, time);
  }

  noteUpdate(tickStartTime) {
    tickStartTime += this.context.currentTime; // find note we should be playing

    for (var i = this.heldNotes.length - 1; i >= 0; i--) {
      if (this.heldNotes[i]) {
        break;
      }
    }

    if (i == -1 && this.currentNote > 0) {
      // no notes are held, time to release the envelope
      let releaseTime = 0.002 + this.parameters.envRelease * 9.998;

      if (this.parameters.vcaSource == 0) {
        this.vca.gain.setTargetAtTime(0.0, tickStartTime, releaseTime / 5);
      } else {
        this.vca.gain.setTargetAtTime(0.0, tickStartTime, 0.01);
      }

      this.env.gain.setTargetAtTime(0.0, tickStartTime, releaseTime / 5);
      this.currentNote = -1;
    }

    if (i > -1 && this.currentNote != i) {
      let portamento = this.parameters.portamentoMode == 2 || this.parameters.portamentoMode == 1 && this.currentNote != -1; // set frequencies

      this.setPitch(i, tickStartTime, portamento);

      if (this.currentNote == -1) {
        // time to start the envelope
        // ideal decay time is decayTime
        // setTargetAtTime will approach the ideal value approximately 63.2% every period
        // (1-.632)^5 = under 1% remaining
        // so a period 5x faster than our ideal decay time will be approximately right
        let attackTime = 0.0015 + this.parameters.envAttack * this.parameters.envAttack * 3.9985;
        let decayTime = 0.002 + this.parameters.envDecay * 9.998;

        if (this.parameters.vcaSource == 0) {
          this.vca.gain.setTargetAtTime(1.0, tickStartTime, attackTime / 5);
          this.vca.gain.setTargetAtTime(this.parameters.envSustain, tickStartTime + attackTime, decayTime / 5);
        } else {
          this.vca.gain.setTargetAtTime(1.0, tickStartTime, 0.01);
        }

        this.env.gain.setTargetAtTime(1.0, tickStartTime, attackTime / 5);
        this.env.gain.setTargetAtTime(this.parameters.envSustain, tickStartTime + attackTime, decayTime / 5);
      }

      this.currentNote = i;
    }
  }

  updateFromState() {
    let state = this.parameters;

    if (!this.oscillator) {
      return;
    } // Oscillator


    this.oscillator.detune.setValueAtTime(state.detune * 100, 0);
    this.lfoOscMod.gain.setValueAtTime(state.oscMod * state.oscMod * 200, 0); // sub oscillator

    if (state.subRange == 0) {
      this.subOsc.detune.setValueAtTime(-1200, 0);
    } else {
      this.subOsc.detune.setValueAtTime(-2400, 0);
    }

    let subWaves = ["square", "square", "sine", "triangle"];
    this.subOsc.type = subWaves[state.subRange]; // PWM
    // TODO this needs a scope on it to look at it

    if (state.pwmSource == 0) {
      this.pulseGain.gain.setValueAtTime(1.0, 0);
      this.envPWM.gain.setValueAtTime(0, 0);
      this.lfoPWM.gain.setValueAtTime(state.pulseWidth * 0.2, 0);
    } else if (state.pwmSource == 1) {
      this.lfoPWM.gain.setValueAtTime(0, 0);
      this.envPWM.gain.setValueAtTime(0, 0);
      this.pulseGain.gain.setValueAtTime(1.0 - state.pulseWidth * 0.4, 0);
    } else if (state.pwmSource == 2) {
      this.pulseGain.gain.setValueAtTime(1.0, 0);
      this.lfoPWM.gain.setValueAtTime(0, 0);
      this.envPWM.gain.setValueAtTime(state.pulseWidth * -0.5, 0);
    } // LFO update


    this.lfo.type = lfoWaves$2[state.lfoWaveform];
    let lfoFrequency = 0.1 + 29.9 * state.lfoRate * state.lfoRate;
    this.lfo.frequency.setValueAtTime(lfoFrequency, 0); // Mixer

    this.mixerSaw.gain.setValueAtTime(state.mixerSaw, 0);
    this.mixerPulse.gain.setValueAtTime(state.mixerPulse, 0);
    this.mixerSub.gain.setValueAtTime(state.mixerSub, 0);
    this.mixerNoise.gain.setValueAtTime(state.mixerNoise, 0); // Filter

    let baseFreq = 10 + 19990 * state.filterFreq * state.filterFreq;
    this.filters.forEach(filter => {
      filter.frequency.setValueAtTime(baseFreq, 0);
      filter.Q.setValueAtTime(state.filterRes * 8, 0);
    });
    this.lfoFilter.gain.setValueAtTime(2400 * state.filterMod, 0);
    this.envFilter.gain.setValueAtTime(2400 * state.filterEnv, 0);

    if (state.vcaSource == 0) {
      this.envVCA.gain.setValueAtTime(1, 0);
    } else {
      this.envVCA.gain.setValueAtTime(0, 0);
    }
  }

}

var n,l,u,t,o,r,e={},c=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function a(n,l){for(var u in l)n[u]=l[u];return n}function h(n){var l=n.parentNode;l&&l.removeChild(n);}function v(l,u,i){var t,o,r,f={};for(r in u)"key"==r?t=u[r]:"ref"==r?o=u[r]:f[r]=u[r];if(arguments.length>2&&(f.children=arguments.length>3?n.call(arguments,2):i),"function"==typeof l&&null!=l.defaultProps)for(r in l.defaultProps)void 0===f[r]&&(f[r]=l.defaultProps[r]);return y(l,f,t,o,null)}function y(n,i,t,o,r){var f={type:n,props:i,key:t,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++u:r};return null==r&&null!=l.vnode&&l.vnode(f),f}function d(n){return n.children}function _(n,l){this.props=n,this.context=l;}function k(n,l){if(null==l)return n.__?k(n.__,n.__.__k.indexOf(n)+1):null;for(var u;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e)return u.__e;return "function"==typeof n.type?k(n):null}function b(n){var l,u;if(null!=(n=n.__)&&null!=n.__c){for(n.__e=n.__c.base=null,l=0;l<n.__k.length;l++)if(null!=(u=n.__k[l])&&null!=u.__e){n.__e=n.__c.base=u.__e;break}return b(n)}}function m(n){(!n.__d&&(n.__d=!0)&&t.push(n)&&!g.__r++||r!==l.debounceRendering)&&((r=l.debounceRendering)||o)(g);}function g(){for(var n;g.__r=t.length;)n=t.sort(function(n,l){return n.__v.__b-l.__v.__b}),t=[],n.some(function(n){var l,u,i,t,o,r;n.__d&&(o=(t=(l=n).__v).__e,(r=l.__P)&&(u=[],(i=a({},t)).__v=t.__v+1,j(r,t,i,l.__n,void 0!==r.ownerSVGElement,null!=t.__h?[o]:null,u,null==o?k(t):o,t.__h),z(u,t),t.__e!=o&&b(t)));});}function w(n,l,u,i,t,o,r,f,s,a){var h,v,p,_,b,m,g,w=i&&i.__k||c,A=w.length;for(u.__k=[],h=0;h<l.length;h++)if(null!=(_=u.__k[h]=null==(_=l[h])||"boolean"==typeof _?null:"string"==typeof _||"number"==typeof _||"bigint"==typeof _?y(null,_,null,null,_):Array.isArray(_)?y(d,{children:_},null,null,null):_.__b>0?y(_.type,_.props,_.key,null,_.__v):_)){if(_.__=u,_.__b=u.__b+1,null===(p=w[h])||p&&_.key==p.key&&_.type===p.type)w[h]=void 0;else for(v=0;v<A;v++){if((p=w[v])&&_.key==p.key&&_.type===p.type){w[v]=void 0;break}p=null;}j(n,_,p=p||e,t,o,r,f,s,a),b=_.__e,(v=_.ref)&&p.ref!=v&&(g||(g=[]),p.ref&&g.push(p.ref,null,_),g.push(v,_.__c||b,_)),null!=b?(null==m&&(m=b),"function"==typeof _.type&&_.__k===p.__k?_.__d=s=x(_,s,n):s=P(n,_,p,w,b,s),"function"==typeof u.type&&(u.__d=s)):s&&p.__e==s&&s.parentNode!=n&&(s=k(p));}for(u.__e=m,h=A;h--;)null!=w[h]&&("function"==typeof u.type&&null!=w[h].__e&&w[h].__e==u.__d&&(u.__d=k(i,h+1)),N(w[h],w[h]));if(g)for(h=0;h<g.length;h++)M(g[h],g[++h],g[++h]);}function x(n,l,u){for(var i,t=n.__k,o=0;t&&o<t.length;o++)(i=t[o])&&(i.__=n,l="function"==typeof i.type?x(i,l,u):P(u,i,i,t,i.__e,l));return l}function P(n,l,u,i,t,o){var r,f,e;if(void 0!==l.__d)r=l.__d,l.__d=void 0;else if(null==u||t!=o||null==t.parentNode)n:if(null==o||o.parentNode!==n)n.appendChild(t),r=null;else {for(f=o,e=0;(f=f.nextSibling)&&e<i.length;e+=2)if(f==t)break n;n.insertBefore(t,o),r=o;}return void 0!==r?r:t.nextSibling}function C(n,l,u,i,t){var o;for(o in u)"children"===o||"key"===o||o in l||H(n,o,null,u[o],i);for(o in l)t&&"function"!=typeof l[o]||"children"===o||"key"===o||"value"===o||"checked"===o||u[o]===l[o]||H(n,o,l[o],u[o],i);}function $(n,l,u){"-"===l[0]?n.setProperty(l,u):n[l]=null==u?"":"number"!=typeof u||s.test(l)?u:u+"px";}function H(n,l,u,i,t){var o;n:if("style"===l)if("string"==typeof u)n.style.cssText=u;else {if("string"==typeof i&&(n.style.cssText=i=""),i)for(l in i)u&&l in u||$(n.style,l,"");if(u)for(l in u)i&&u[l]===i[l]||$(n.style,l,u[l]);}else if("o"===l[0]&&"n"===l[1])o=l!==(l=l.replace(/Capture$/,"")),l=l.toLowerCase()in n?l.toLowerCase().slice(2):l.slice(2),n.l||(n.l={}),n.l[l+o]=u,u?i||n.addEventListener(l,o?T:I,o):n.removeEventListener(l,o?T:I,o);else if("dangerouslySetInnerHTML"!==l){if(t)l=l.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==l&&"list"!==l&&"form"!==l&&"tabIndex"!==l&&"download"!==l&&l in n)try{n[l]=null==u?"":u;break n}catch(n){}"function"==typeof u||(null!=u&&(!1!==u||"a"===l[0]&&"r"===l[1])?n.setAttribute(l,u):n.removeAttribute(l));}}function I(n){this.l[n.type+!1](l.event?l.event(n):n);}function T(n){this.l[n.type+!0](l.event?l.event(n):n);}function j(n,u,i,t,o,r,f,e,c){var s,h,v,y,p,k,b,m,g,x,A,P=u.type;if(void 0!==u.constructor)return null;null!=i.__h&&(c=i.__h,e=u.__e=i.__e,u.__h=null,r=[e]),(s=l.__b)&&s(u);try{n:if("function"==typeof P){if(m=u.props,g=(s=P.contextType)&&t[s.__c],x=s?g?g.props.value:s.__:t,i.__c?b=(h=u.__c=i.__c).__=h.__E:("prototype"in P&&P.prototype.render?u.__c=h=new P(m,x):(u.__c=h=new _(m,x),h.constructor=P,h.render=O),g&&g.sub(h),h.props=m,h.state||(h.state={}),h.context=x,h.__n=t,v=h.__d=!0,h.__h=[]),null==h.__s&&(h.__s=h.state),null!=P.getDerivedStateFromProps&&(h.__s==h.state&&(h.__s=a({},h.__s)),a(h.__s,P.getDerivedStateFromProps(m,h.__s))),y=h.props,p=h.state,v)null==P.getDerivedStateFromProps&&null!=h.componentWillMount&&h.componentWillMount(),null!=h.componentDidMount&&h.__h.push(h.componentDidMount);else {if(null==P.getDerivedStateFromProps&&m!==y&&null!=h.componentWillReceiveProps&&h.componentWillReceiveProps(m,x),!h.__e&&null!=h.shouldComponentUpdate&&!1===h.shouldComponentUpdate(m,h.__s,x)||u.__v===i.__v){h.props=m,h.state=h.__s,u.__v!==i.__v&&(h.__d=!1),h.__v=u,u.__e=i.__e,u.__k=i.__k,u.__k.forEach(function(n){n&&(n.__=u);}),h.__h.length&&f.push(h);break n}null!=h.componentWillUpdate&&h.componentWillUpdate(m,h.__s,x),null!=h.componentDidUpdate&&h.__h.push(function(){h.componentDidUpdate(y,p,k);});}h.context=x,h.props=m,h.state=h.__s,(s=l.__r)&&s(u),h.__d=!1,h.__v=u,h.__P=n,s=h.render(h.props,h.state,h.context),h.state=h.__s,null!=h.getChildContext&&(t=a(a({},t),h.getChildContext())),v||null==h.getSnapshotBeforeUpdate||(k=h.getSnapshotBeforeUpdate(y,p)),A=null!=s&&s.type===d&&null==s.key?s.props.children:s,w(n,Array.isArray(A)?A:[A],u,i,t,o,r,f,e,c),h.base=u.__e,u.__h=null,h.__h.length&&f.push(h),b&&(h.__E=h.__=null),h.__e=!1;}else null==r&&u.__v===i.__v?(u.__k=i.__k,u.__e=i.__e):u.__e=L(i.__e,u,i,t,o,r,f,c);(s=l.diffed)&&s(u);}catch(n){u.__v=null,(c||null!=r)&&(u.__e=e,u.__h=!!c,r[r.indexOf(e)]=null),l.__e(n,u,i);}}function z(n,u){l.__c&&l.__c(u,n),n.some(function(u){try{n=u.__h,u.__h=[],n.some(function(n){n.call(u);});}catch(n){l.__e(n,u.__v);}});}function L(l,u,i,t,o,r,f,c){var s,a,v,y=i.props,p=u.props,d=u.type,_=0;if("svg"===d&&(o=!0),null!=r)for(;_<r.length;_++)if((s=r[_])&&"setAttribute"in s==!!d&&(d?s.localName===d:3===s.nodeType)){l=s,r[_]=null;break}if(null==l){if(null===d)return document.createTextNode(p);l=o?document.createElementNS("http://www.w3.org/2000/svg",d):document.createElement(d,p.is&&p),r=null,c=!1;}if(null===d)y===p||c&&l.data===p||(l.data=p);else {if(r=r&&n.call(l.childNodes),a=(y=i.props||e).dangerouslySetInnerHTML,v=p.dangerouslySetInnerHTML,!c){if(null!=r)for(y={},_=0;_<l.attributes.length;_++)y[l.attributes[_].name]=l.attributes[_].value;(v||a)&&(v&&(a&&v.__html==a.__html||v.__html===l.innerHTML)||(l.innerHTML=v&&v.__html||""));}if(C(l,p,y,o,c),v)u.__k=[];else if(_=u.props.children,w(l,Array.isArray(_)?_:[_],u,i,t,o&&"foreignObject"!==d,r,f,r?r[0]:i.__k&&k(i,0),c),null!=r)for(_=r.length;_--;)null!=r[_]&&h(r[_]);c||("value"in p&&void 0!==(_=p.value)&&(_!==l.value||"progress"===d&&!_||"option"===d&&_!==y.value)&&H(l,"value",_,y.value,!1),"checked"in p&&void 0!==(_=p.checked)&&_!==l.checked&&H(l,"checked",_,y.checked,!1));}return l}function M(n,u,i){try{"function"==typeof n?n(u):n.current=u;}catch(n){l.__e(n,i);}}function N(n,u,i){var t,o;if(l.unmount&&l.unmount(n),(t=n.ref)&&(t.current&&t.current!==n.__e||M(t,null,u)),null!=(t=n.__c)){if(t.componentWillUnmount)try{t.componentWillUnmount();}catch(n){l.__e(n,u);}t.base=t.__P=null;}if(t=n.__k)for(o=0;o<t.length;o++)t[o]&&N(t[o],u,"function"!=typeof n.type);i||null==n.__e||h(n.__e),n.__e=n.__d=void 0;}function O(n,l,u){return this.constructor(n,u)}function S(u,i,t){var o,r,f;l.__&&l.__(u,i),r=(o="function"==typeof t)?null:t&&t.__k||i.__k,f=[],j(i,u=(!o&&t||i).__k=v(d,null,[u]),r||e,e,void 0!==i.ownerSVGElement,!o&&t?[t]:r?null:i.firstChild?n.call(i.childNodes):null,f,!o&&t?t:r?r.__e:i.firstChild,o),z(f,u);}n=c.slice,l={__e:function(n,l){for(var u,i,t;l=l.__;)if((u=l.__c)&&!u.__)try{if((i=u.constructor)&&null!=i.getDerivedStateFromError&&(u.setState(i.getDerivedStateFromError(n)),t=u.__d),null!=u.componentDidCatch&&(u.componentDidCatch(n),t=u.__d),t)return u.__E=u}catch(l){n=l;}throw n}},u=0,_.prototype.setState=function(n,l){var u;u=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=a({},this.state),"function"==typeof n&&(n=n(a({},u),this.props)),n&&a(u,n),null!=n&&this.__v&&(l&&this.__h.push(l),m(this));},_.prototype.forceUpdate=function(n){this.__v&&(this.__e=!0,n&&this.__h.push(n),m(this));},_.prototype.render=d,t=[],o="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,g.__r=0;

const svgns = "http://www.w3.org/2000/svg";
const cos = Math.cos;
const sin = Math.sin;
const Ï€ = Math.PI;

const f_matrix_times = (_ref, _ref2) => {
  let [[a, b], [c, d]] = _ref;
  let [x, y] = _ref2;
  return [a * x + b * y, c * x + d * y];
};

const f_rotate_matrix = x => {
  const cosx = cos(x);
  const sinx = sin(x);
  return [[cosx, -sinx], [sinx, cosx]];
};

const f_vec_add = (_ref3, _ref4) => {
  let [a1, a2] = _ref3;
  let [b1, b2] = _ref4;
  return [a1 + b1, a2 + b2];
};

function svg_arc(_ref5, _ref6, _ref7, Ï†) {
  let [cx, cy] = _ref5;
  let [rx, ry] = _ref6;
  let [t1, Î”] = _ref7;

  /* [
  returns a a array that represent a ellipse for SVG path element d attribute.
  cx,cy Ã¢â€ â€™ center of ellipse.
  rx,ry Ã¢â€ â€™ major minor radius.
  t1 Ã¢â€ â€™ start angle, in radian.
  ÃŽâ€ Ã¢â€ â€™ angle to sweep, in radian. positive.
  Ãâ€  Ã¢â€ â€™ rotation on the whole, in radian.
  url: SVG Circle Arc http://xahlee.info/js/svg_circle_arc.html
  Version 2019-06-19
      ] */
  Î” = Î” / 180 * Ï€;
  Î” = Î” % (2 * Ï€);
  t1 = t1 / 180 * Ï€;
  const rotMatrix = f_rotate_matrix(Ï†);
  const [sX, sY] = f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1), ry * sin(t1)]), [cx, cy]);
  const [eX, eY] = f_vec_add(f_matrix_times(rotMatrix, [rx * cos(t1 + Î”), ry * sin(t1 + Î”)]), [cx, cy]);
  const fA = Î” > Ï€ ? 1 : 0;
  const fS = Î” > 0 ? 1 : 0;
  let cmd = [" M ", sX, " ", sY, " A ", rx, ry, Ï† / Ï€ * 180, fA, fS, eX, eY].join(" ");
  const path = document.createElementNS(svgns, "path");
  path.setAttribute("d", cmd);
  return path;
}
function svg_rectangle(x, y, width, height, fill) {
  var rect = document.createElementNS(svgns, 'rect');
  rect.setAttributeNS(null, 'x', x.toString());
  rect.setAttributeNS(null, 'y', y.toString());
  rect.setAttributeNS(null, 'height', height.toString());
  rect.setAttributeNS(null, 'width', width.toString());
  rect.setAttributeNS(null, 'fill', fill);
  return rect;
}
function svg_line(x1, y1, x2, y2, stroke) {
  var line = document.createElementNS(svgns, 'line');
  line.setAttribute('x1', x1.toString());
  line.setAttribute('y1', y1.toString());
  line.setAttribute('x2', x2.toString());
  line.setAttribute('y2', y2.toString());
  line.setAttribute("stroke", stroke);
  return line;
}

class Knob extends _ {
  constructor() {
    super();

    _defineProperty(this, "pressed", void 0);

    _defineProperty(this, "ref", void 0);

    _defineProperty(this, "position", void 0);

    this.pressed = false;
    this.onMousemove = this.onMousemove.bind(this);
    this.onMouseup = this.onMouseup.bind(this);
    this.state = {
      value: 0.5
    };
  }

  componentWillMount() {
    this.updateStateFromProps();
  }

  componentDidMount() {}

  componentWillReceiveProps() {
    this.updateStateFromProps();
  }

  updateStateFromProps() {
    if (!this.pressed) {
      this.setState({
        value: this.props.value
      });
    }
  }

  componentWillUnmount() {
    if (this.pressed) {
      window.removeEventListener('mousemove', this.onMousemove);
      window.removeEventListener('mouseup', this.onMouseup);
    }
  }

  setup(ref) {
    if (ref == null) {
      return;
    }

    this.ref = ref;
    ref.innerHTML = "";
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('style', "stroke:black; fill:none; stroke-width:2");
    svg.setAttribute('width', "".concat(this.props.size));
    svg.setAttribute('height', "".concat(this.props.size * 4 / 5));
    let center = [this.props.size / 2, this.props.size / 2];
    let radii = [center[0] - this.props.padding, center[1] - this.props.padding];
    let element = svg_arc(center, radii, [136, 270], 0);
    element.setAttribute('style', 'stroke:black;');
    svg.appendChild(element);
    var e2;

    if (this.props.bipolar) {
      let midValue = (this.props.maximumValue + this.props.minimumValue) / 2;
      let percent = (this.state.value - midValue) / (midValue - this.props.minimumValue);
      e2 = svg_arc(center, radii, [270, 135 * percent], 0);
    } else {
      let percent = (this.state.value - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue);
      e2 = svg_arc(center, radii, [135, 270 * percent], 0);
    }

    e2.setAttribute('style', "stroke:".concat(this.props.color, ";"));
    svg.appendChild(e2);
    ref.appendChild(svg);
  }

  onMousedown(e) {
    this.pressed = true;
    this.position = {
      x: e.screenX,
      y: e.screenY
    };
    window.addEventListener('mousemove', this.onMousemove);
    window.addEventListener('mouseup', this.onMouseup);
  }

  onMouseup(e) {
    this.pressed = false;
    window.removeEventListener('mousemove', this.onMousemove);
    window.removeEventListener('mouseup', this.onMouseup);
  }

  onMousemove(e) {
    if (this.pressed) {
      let distance = e.screenX - this.position.x - (e.screenY - this.position.y);
      this.position = {
        x: e.screenX,
        y: e.screenY
      };
      this.setValue(this.state.value + distance * 0.005 * (this.props.maximumValue - this.props.minimumValue));
    }
  }

  setValue(v) {
    if (v > this.props.maximumValue) {
      v = this.props.maximumValue;
    }

    if (v < this.props.minimumValue) {
      v = this.props.minimumValue;
    }

    if (this.props.onChange) {
      this.props.onChange(v);
    }

    this.setState({
      value: v
    });
  }

  render() {
    v("div", {});
    return v("div", {
      class: "component-wrapper"
    }, v("div", {
      ref: _ref => this.setup(_ref),
      class: "component-knob flex flex-col items-center",
      onMouseDown: e => this.onMousedown(e)
    }), v("label", null, this.props.label));
  }

}

_defineProperty(Knob, "defaultProps", {
  minimumValue: 0.0,
  maximumValue: 1.0,
  size: 50,
  value: 0.5,
  padding: 3,
  color: 'yellow',
  label: "",
  bipolar: false
});

class Select extends _ {
  constructor() {
    super();

    _defineProperty(this, "lastRenderedValue", void 0);

    this.lastRenderedValue = "-1";
  }

  onChange(e) {
    if (this.props.onChange) {
      this.props.onChange(e.target.value);
    }
  }

  setup(ref) {
    if (ref == null) {
      return;
    }

    if (this.lastRenderedValue == this.props.value) {
      return;
    }

    ref.innerHTML = "";

    if (this.props.value === undefined || this.props.value === null) {
      throw "Select with label ".concat(this.props.label, " values ").concat(this.props.values, " has null value");
    }

    this.lastRenderedValue = this.props.value.toString();
    let select = document.createElement("select");
    this.props.options.forEach((name, index) => {
      let option = document.createElement("option");
      option.text = name;
      option.value = this.props.values ? this.props.values[index].toString() : index.toString();
      option.selected = option.value == this.props.value;
      select.appendChild(option);
    });
    select.addEventListener("change", e => this.onChange(e));
    ref.appendChild(select);
  }

  render() {
    v("div", {});
    let style = this.props.style ? this.props.style : "";
    return v("div", {
      class: "component-wrapper",
      style: style
    }, v("div", {
      ref: e => this.setup(e),
      class: "component-select text-black"
    }), this.props.label && v("label", null, this.props.label));
  }

}

class Fader extends _ {
  constructor() {
    super();

    _defineProperty(this, "pressed", void 0);

    _defineProperty(this, "ref", void 0);

    _defineProperty(this, "position", void 0);

    this.pressed = false;
    this.onMousemove = this.onMousemove.bind(this);
    this.onMouseup = this.onMouseup.bind(this);
    this.state = {
      value: 0.5
    };
  }

  componentWillMount() {
    this.updateStateFromProps();
  }

  componentDidMount() {}

  componentWillReceiveProps() {
    this.updateStateFromProps();
  }

  updateStateFromProps() {
    if (!this.pressed) {
      this.setState({
        value: this.props.value
      });
    }
  }

  componentWillUnmount() {
    if (this.pressed) {
      window.removeEventListener('mousemove', this.onMousemove);
      window.removeEventListener('mouseup', this.onMouseup);
    }
  }

  setup(ref) {
    if (ref == null) {
      return;
    }

    this.ref = ref;
    ref.innerHTML = "";
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('style', "stroke:black; fill:none; stroke-width:2");
    svg.setAttribute('width', "".concat(this.props.width, "px"));
    svg.setAttribute('height', "".concat(this.props.height));
    let center = this.props.width / 2;
    let track = svg_line(center, 0, center, this.props.height, "black");
    let percent = (this.state.value - this.props.minimumValue) / (this.props.maximumValue - this.props.minimumValue);
    let position = this.props.height - this.props.capHeight - (this.props.height - this.props.capHeight) * percent;
    let fader = svg_rectangle(center - this.props.capWidth / 2, position, this.props.capWidth, this.props.capHeight, this.props.color);
    svg.appendChild(track);
    svg.appendChild(fader);
    ref.appendChild(svg);
  }

  onMousedown(e) {
    this.pressed = true;
    this.position = {
      x: e.screenX,
      y: e.screenY
    };
    window.addEventListener('mousemove', this.onMousemove);
    window.addEventListener('mouseup', this.onMouseup);
  }

  onMouseup(e) {
    this.pressed = false;
    window.removeEventListener('mousemove', this.onMousemove);
    window.removeEventListener('mouseup', this.onMouseup);
  }

  onMousemove(e) {
    if (this.pressed) {
      let distance = e.screenY - this.position.y;
      this.position = {
        x: e.screenX,
        y: e.screenY
      };
      this.setValue(this.state.value - distance * 0.01 * (this.props.maximumValue - this.props.minimumValue));
    }
  }

  setValue(v) {
    if (v > this.props.maximumValue) {
      v = this.props.maximumValue;
    }

    if (v < this.props.minimumValue) {
      v = this.props.minimumValue;
    }

    if (this.props.onChange) {
      this.props.onChange(v);
    }

    this.setState({
      value: v
    });
  }

  render() {
    v("div", {});
    return v("div", {
      class: "component-wrapper"
    }, v("div", {
      ref: _ref => this.setup(_ref),
      class: "component-fader flex flex-col items-center",
      onMouseDown: e => this.onMousedown(e)
    }), v("label", null, this.props.label ? this.props.label : ""));
  }

}

_defineProperty(Fader, "defaultProps", {
  minimumValue: 0.0,
  maximumValue: 1.0,
  width: 30,
  height: 120,
  capWidth: 20,
  capHeight: 8,
  value: 0.5,
  padding: 5,
  color: 'yellow'
});

let lfoWaves$1 = ["triangle", "square"];
let ranges$1 = ["32'", "16'", "8'", "4'"];
let pwms$1 = ["LFO", "Manual", "Env"];
let subRanges$1 = ["-10ct", "-20ct pulse", "-20ct sine", "-20ct tri"];
let vcaSources$1 = ["Env", "Gate"];
let envTriggers$1 = ["Gate", "Trig", "Both"];
let portamentoModes$1 = ["Off", "Auto", "On"];
class SynthView extends _ {
  constructor() {
    super();
  } // Lifecycle: Called whenever our component is created


  componentDidMount() {} // Lifecycle: Called just before our component will be destroyed


  componentWillUnmount() {
    console.log("Synth-101 unmounting");
  }

  detuneChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("detune", value);
  }

  waveformChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("waveform", value);
  }

  lfoRateChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("lfoRate", value);
  }

  lfoWaveformChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("lfoWaveform", value);
  }

  oscModChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("oscMod", value);
  }

  oscRangeChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("oscRange", value);
  }

  pulseWidthChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("pulseWidth", value);
  }

  pwmSourceChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("pwmSource", value);
  }

  subRangeChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("subRange", value);
  }

  mixerPulseChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("mixerPulse", value);
  }

  mixerSawChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("mixerSaw", value);
  }

  mixerSubChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("mixerSub", value);
  }

  mixerNoiseChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("mixerNoise", value);
  }

  filterFreqChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("filterFreq", value);
  }

  filterResChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("filterRes", value);
  }

  filterEnvChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("filterEnv", value);
  }

  filterModChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("filterMod", value);
  }

  filterKybdChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("filterKeyboard", value);
  }

  vcaSourceChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("vcaSource", value);
  }

  envTriggerChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("envTrigger", value);
  }

  envAttackChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("envAttack", value);
  }

  envDecayChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("envDecay", value);
  }

  envSustainChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("envSustain", value);
  }

  envReleaseChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("envRelease", value);
  }

  portamentoModeChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("portamentoMode", value);
  }

  portamentoTimeChanged(value) {
    this.props.plugin.audioNode.paramMgr.setParamValue("portamentoTime", value);
  }

  render() {
    v("div", {});
    let params = this.props.plugin.audioNode.paramMgr;
    return v("div", {
      class: "synth-101"
    }, v("div", {
      class: "synth-101-section"
    }, v("div", {
      class: "synth-101-header"
    }, "Portamento"), v("div", {
      class: "synth-101-section-content",
      style: "flex-direction: column"
    }, v(Knob, {
      label: "Time",
      value: params.getParamValue("portamentoTime"),
      onChange: e => this.portamentoTimeChanged(e)
    }), v(Select, {
      label: "Mode",
      options: portamentoModes$1,
      value: params.getParamValue("portamentoMode"),
      onChange: e => this.portamentoModeChanged(parseInt(e))
    }))), v("div", {
      class: "synth-101-section"
    }, v("div", {
      class: "synth-101-header"
    }, "LFO"), v("div", {
      class: "synth-101-section-content",
      style: "flex-direction: column"
    }, v(Knob, {
      label: "Rate",
      value: params.getParamValue("lfoRate"),
      onChange: e => this.lfoRateChanged(e)
    }), v(Select, {
      label: "Waveform",
      options: lfoWaves$1,
      value: params.getParamValue("lfoWaveform"),
      onChange: e => this.lfoWaveformChanged(parseInt(e))
    }))), v("div", {
      class: "synth-101-section"
    }, v("div", {
      class: "synth-101-header"
    }, "Oscillator"), v("div", {
      class: "synth-101-section-content"
    }, v("div", {
      style: "display: flex; flex-direction: column"
    }, v(Knob, {
      label: "Tune",
      value: params.getParamValue("detune"),
      minimumValue: -0.5,
      maximumValue: 0.5,
      bipolar: true,
      onChange: e => this.detuneChanged(e)
    }), v(Select, {
      label: "Range",
      options: ranges$1,
      value: params.getParamValue("oscRange"),
      onChange: e => this.oscRangeChanged(parseInt(e))
    })), v(Fader, {
      label: "Mod",
      value: params.getParamValue("oscMod"),
      onChange: e => this.oscModChanged(e)
    }), v(Fader, {
      label: "PW",
      value: params.getParamValue("pulseWidth"),
      onChange: e => this.pulseWidthChanged(e)
    }), v("div", {
      style: "display: flex; flex-direction: column"
    }, v(Select, {
      label: "PWM",
      options: pwms$1,
      value: params.getParamValue("pwmSource"),
      onChange: e => this.pwmSourceChanged(parseInt(e))
    }), v(Select, {
      label: "Sub Range",
      options: subRanges$1,
      value: params.getParamValue("subRange"),
      onChange: e => this.subRangeChanged(parseInt(e))
    })))), v("div", {
      class: "synth-101-section"
    }, v("div", {
      class: "synth-101-header"
    }, "Mixer"), v("div", {
      class: "synth-101-section-content"
    }, v(Fader, {
      label: "Pulse",
      value: params.getParamValue("mixerPulse"),
      onChange: e => this.mixerPulseChanged(e)
    }), v(Fader, {
      label: "Saw",
      value: params.getParamValue("mixerSaw"),
      onChange: e => this.mixerSawChanged(e)
    }), v(Fader, {
      label: "Sub",
      value: params.getParamValue("mixerSub"),
      onChange: e => this.mixerSubChanged(e)
    }), v(Fader, {
      label: "Noise",
      value: params.getParamValue("mixerNoise"),
      onChange: e => this.mixerNoiseChanged(e)
    }))), v("div", {
      class: "synth-101-section"
    }, v("div", {
      class: "synth-101-header"
    }, "Filter"), v("div", {
      class: "synth-101-section-content"
    }, v(Fader, {
      label: "Freq",
      value: params.getParamValue("filterFreq"),
      onChange: e => this.filterFreqChanged(e)
    }), v(Fader, {
      label: "Res",
      value: params.getParamValue("filterRes"),
      onChange: e => this.filterResChanged(e)
    }), v("div", {
      style: "width: 10px;"
    }, " "), v(Fader, {
      label: "Env",
      value: params.getParamValue("filterEnv"),
      onChange: e => this.filterEnvChanged(e)
    }), v(Fader, {
      label: "Mod",
      value: params.getParamValue("filterMod"),
      onChange: e => this.filterModChanged(e)
    }), v(Fader, {
      label: "Kybd",
      value: params.getParamValue("filterKybd"),
      onChange: e => this.filterKybdChanged(e)
    }))), v("div", {
      class: "synth-101-section"
    }, v("div", {
      class: "synth-101-header"
    }, "VCA / Env"), v("div", {
      class: "synth-101-section-content"
    }, v("div", {
      style: "display: flex; flex-direction: column"
    }, v(Select, {
      label: "VCA",
      options: vcaSources$1,
      value: params.getParamValue("vcaSource"),
      onChange: e => this.vcaSourceChanged(parseInt(e))
    }), v(Select, {
      label: "Trigger",
      options: envTriggers$1,
      value: params.getParamValue("envTrigger"),
      onChange: e => this.envTriggerChanged(parseInt(e))
    })), v(Fader, {
      label: "A",
      value: params.getParamValue("envAttack"),
      onChange: e => this.envAttackChanged(e)
    }), v(Fader, {
      label: "D",
      value: params.getParamValue("envDecay"),
      onChange: e => this.envDecayChanged(e)
    }), v(Fader, {
      label: "S",
      value: params.getParamValue("envSustain"),
      onChange: e => this.envSustainChanged(e)
    }), v(Fader, {
      label: "R",
      value: params.getParamValue("envRelease"),
      onChange: e => this.envReleaseChanged(e)
    }))), v("style", null, this.css()));
  }

  css() {
    // this is bad but quick :)
    return "\n      .synth-101 {\n        background-color: #4773cc;\n        color: white;\n        display: flex;\n    }\n    \n    .synth-101 .component-wrapper {\n        padding: 5px;\n    }\n    \n    .synth-101-section {\n        /* border: 1px solid white; */\n        border: 1px solid rgba(0,0,0,0.3);\n    \n        border-radius: 2px;\n        margin: 5px;\n        display: flex;\n        flex-direction: column;\n    }\n    \n    .synth-101-header {\n        background-color: rgba(0,0,0,0.2);\n        padding: 2px;\n    }\n    \n    .synth-101-section-content {\n        display: flex;\n        justify-content: stretch;\n        flex: 1;\n        padding: 10px;\n    }\n    \n    /* UI elements */\n    \n    .component-wrapper {\n        display: flex;\n        flex-direction: column; \n        align-content: center; \n        text-align: center;\n        flex: 1;\n    }\n    \n    .component-knob, .component-fader {\n        margin-top: auto;\n    }\n    \n    .component-select {\n        margin-top: auto;\n        margin-bottom: 3px;\n    }\n    ";
  }

}

/**
 * @param {URL} relativeURL
 * @returns {string}
 */

const getBasetUrl = relativeURL => {
  const baseURL = relativeURL.href.substring(0, relativeURL.href.lastIndexOf('/'));
  return baseURL;
};

let waves = ["sine", "square", "sawtooth", "triangle"];
let lfoWaves = ["triangle", "square"];
let ranges = ["32'", "16'", "8'", "4'"];
let pwms = ["LFO", "Manual", "Env"];
let subRanges = ["-10ct", "-20ct pulse", "-20ct sine", "-20ct tri"];
let vcaSources = ["Env", "Gate"];
let envTriggers = ["Gate", "Trig", "Both"];
let portamentoModes = ["Off", "Auto", "On"];
class Synth101 extends WebAudioModule_default {
  constructor() {
    super(...arguments);

    _defineProperty(this, "_baseURL", getBasetUrl(new URL('.', import.meta.url)));

    _defineProperty(this, "_descriptorUrl", "".concat(this._baseURL, "/descriptor.json"));
  }

  async _loadDescriptor() {
    const url = this._descriptorUrl;
    if (!url) throw new TypeError('Descriptor not found');
    const response = await fetch(url);
    const descriptor = await response.json();
    Object.assign(this.descriptor, descriptor);
    return this.descriptor;
  }

  async initialize(state) {
    await this._loadDescriptor();
    return super.initialize(state);
  }

  async createAudioNode(initialState) {
    const synthNode = new Synth101Node(this.audioContext);
    const paramsConfig = {
      waveform: {
        defaultValue: 0,
        minValue: 0,
        maxValue: waves.length - 1
      },
      detune: {
        defaultValue: 0,
        minValue: -1,
        maxValue: 1
      },
      lfoRate: {
        defaultValue: 0.2,
        minValue: 0,
        maxValue: 1
      },
      lfoWaveform: {
        defaultValue: 0,
        minValue: 0,
        maxValue: lfoWaves.length - 1
      },
      oscMod: {
        defaultValue: 0,
        minValue: 0,
        maxValue: 1
      },
      oscRange: {
        defaultValue: 0,
        minValue: 0,
        maxValue: ranges.length - 1
      },
      pulseWidth: {
        defaultValue: 0,
        minValue: 0,
        maxValue: 1
      },
      pwmSource: {
        defaultValue: 0,
        minValue: 0,
        maxValue: pwms.length - 1
      },
      subRange: {
        defaultValue: 0,
        minValue: 0,
        maxValue: subRanges.length - 1
      },
      mixerSaw: {
        defaultValue: 1,
        minValue: 0,
        maxValue: 1
      },
      mixerPulse: {
        defaultValue: 0,
        minValue: 0,
        maxValue: 1
      },
      mixerSub: {
        defaultValue: 0,
        minValue: 0,
        maxValue: 1
      },
      mixerNoise: {
        defaultValue: 0,
        minValue: 0,
        maxValue: 1
      },
      filterFreq: {
        defaultValue: 0.2,
        minValue: 0,
        maxValue: 1
      },
      filterRes: {
        defaultValue: 0.05,
        minValue: 0,
        maxValue: 1
      },
      filterEnv: {
        defaultValue: 0.15,
        minValue: 0,
        maxValue: 1
      },
      filterMod: {
        defaultValue: 0,
        minValue: 0,
        maxValue: 1
      },
      filterKeyboard: {
        defaultValue: 0,
        minValue: 0,
        maxValue: 1
      },
      vcaSource: {
        defaultValue: 0,
        minValue: 0,
        maxValue: vcaSources.length - 1
      },
      envTrigger: {
        defaultValue: 0,
        minValue: 0,
        maxValue: envTriggers.length - 1
      },
      envAttack: {
        defaultValue: 0,
        minValue: 0,
        maxValue: 1
      },
      envDecay: {
        defaultValue: 0.2,
        minValue: 0,
        maxValue: 1
      },
      envSustain: {
        defaultValue: 0,
        minValue: 0,
        maxValue: 1
      },
      envRelease: {
        defaultValue: 0,
        minValue: 0,
        maxValue: 1
      },
      portamentoMode: {
        defaultValue: 0,
        minValue: 0,
        maxValue: portamentoModes.length - 1
      },
      portamentoTime: {
        defaultValue: 0,
        minValue: 0,
        maxValue: 1
      }
    };
    const internalParamsConfig = {
      waveform: {
        onChange: v => {
          synthNode.parameters.waveform = v;
          synthNode.updateFromState();
        }
      },
      detune: {
        onChange: v => {
          synthNode.parameters.detune = v;
          synthNode.updateFromState();
        }
      },
      lfoRate: {
        onChange: v => {
          synthNode.parameters.lfoRate = v;
          synthNode.updateFromState();
        }
      },
      lfoWaveform: {
        onChange: v => {
          synthNode.parameters.lfoWaveform = v;
          synthNode.updateFromState();
        }
      },
      oscMod: {
        onChange: v => {
          synthNode.parameters.oscMod = v;
          synthNode.updateFromState();
        }
      },
      oscRange: {
        onChange: v => {
          synthNode.parameters.oscRange = v;
          synthNode.updateFromState();
        }
      },
      pulseWidth: {
        onChange: v => {
          synthNode.parameters.pulseWidth = v;
          synthNode.updateFromState();
        }
      },
      pwmSource: {
        onChange: v => {
          synthNode.parameters.pwmSource = v;
          synthNode.updateFromState();
        }
      },
      subRange: {
        onChange: v => {
          synthNode.parameters.subRange = v;
          synthNode.updateFromState();
        }
      },
      mixerSaw: {
        onChange: v => {
          synthNode.parameters.mixerSaw = v;
          synthNode.updateFromState();
        }
      },
      mixerPulse: {
        onChange: v => {
          synthNode.parameters.mixerPulse = v;
          synthNode.updateFromState();
        }
      },
      mixerSub: {
        onChange: v => {
          synthNode.parameters.mixerSub = v;
          synthNode.updateFromState();
        }
      },
      mixerNoise: {
        onChange: v => {
          synthNode.parameters.mixerNoise = v;
          synthNode.updateFromState();
        }
      },
      filterFreq: {
        onChange: v => {
          synthNode.parameters.filterFreq = v;
          synthNode.updateFromState();
        }
      },
      filterRes: {
        onChange: v => {
          synthNode.parameters.filterRes = v;
          synthNode.updateFromState();
        }
      },
      filterEnv: {
        onChange: v => {
          synthNode.parameters.filterEnv = v;
          synthNode.updateFromState();
        }
      },
      filterMod: {
        onChange: v => {
          synthNode.parameters.filterMod = v;
          synthNode.updateFromState();
        }
      },
      filterKeyboard: {
        onChange: v => {
          synthNode.parameters.filterKeyboard = v;
          synthNode.updateFromState();
        }
      },
      vcaSource: {
        onChange: v => {
          synthNode.parameters.vcaSource = v;
          synthNode.updateFromState();
        }
      },
      envTrigger: {
        onChange: v => {
          synthNode.parameters.envTrigger = v;
          synthNode.updateFromState();
        }
      },
      envAttack: {
        onChange: v => {
          synthNode.parameters.envAttack = v;
          synthNode.updateFromState();
        }
      },
      envDecay: {
        onChange: v => {
          synthNode.parameters.envDecay = v;
          synthNode.updateFromState();
        }
      },
      envSustain: {
        onChange: v => {
          synthNode.parameters.envSustain = v;
          synthNode.updateFromState();
        }
      },
      envRelease: {
        onChange: v => {
          synthNode.parameters.envRelease = v;
          synthNode.updateFromState();
        }
      },
      portamentoMode: {
        onChange: v => {
          synthNode.parameters.portamentoMode = v;
          synthNode.updateFromState();
        }
      },
      portamentoTime: {
        onChange: v => {
          synthNode.parameters.portamentoTime = v;
          synthNode.updateFromState();
        }
      }
    };
    const optionsIn = {
      internalParamsConfig,
      paramsConfig
    };
    const paramMgrNode = await ParamMgrFactory.create(this, optionsIn);
    synthNode.setup(paramMgrNode);
    if (initialState) synthNode.setState(initialState);
    return synthNode;
  }

  async createGui() {
    const div = document.createElement('div'); // hack because h() is getting stripped for non-use despite it being what the JSX compiles to

    v("div", {});
    var shadow = div.attachShadow({
      mode: 'open'
    });
    S(v(SynthView, {
      plugin: this
    }), shadow);
    return div;
  }

  destroyGui(el) {
    console.log("destroyGui called!");
    S(null, el.shadowRoot);
  }

}

export { Synth101 as default };
