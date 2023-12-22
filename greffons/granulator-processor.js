
/*
Code generated with Faust version 2.38.8
Compilation options: -lang wasm-ib -es 1 -single -ftz 2
*/

function getJSONgranulator() {
	return '{"name": "granulator","filename": "granulator.dsp","version": "2.38.8","compile_options": "-lang wasm-ib -es 1 -single -ftz 2","library_list": ["/usr/local/share/faust/stdfaust.lib","/usr/local/share/faust/filters.lib","/usr/local/share/faust/maths.lib","/usr/local/share/faust/platform.lib","/usr/local/share/faust/basics.lib"],"include_pathnames": ["/usr/local/share/faust","/usr/local/share/faust","/usr/share/faust",".","/home/dominique/public_html/notateur/faust/granulator"],"size": 353100,"inputs": 2,"outputs": 2,"meta": [ { "basics.lib/name": "Faust Basic Element Library" },{ "basics.lib/version": "0.3" },{ "compile_options": "-lang wasm-ib -es 1 -single -ftz 2" },{ "filename": "granulator.dsp" },{ "filters.lib/dcblockerat:author": "Julius O. Smith III" },{ "filters.lib/dcblockerat:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/dcblockerat:license": "MIT-style STK-4.3 license" },{ "filters.lib/lowpass0_highpass1": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/name": "Faust Filters Library" },{ "filters.lib/pole:author": "Julius O. Smith III" },{ "filters.lib/pole:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/pole:license": "MIT-style STK-4.3 license" },{ "filters.lib/version": "0.3" },{ "filters.lib/zero:author": "Julius O. Smith III" },{ "filters.lib/zero:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/zero:license": "MIT-style STK-4.3 license" },{ "maths.lib/author": "GRAME" },{ "maths.lib/copyright": "GRAME" },{ "maths.lib/license": "LGPL with exception" },{ "maths.lib/name": "Faust Math Library" },{ "maths.lib/version": "2.5" },{ "name": "granulator" },{ "platform.lib/name": "Generic Platform Library" },{ "platform.lib/version": "0.2" }],"ui": [ {"type": "vgroup","label": "GRANULATOR","items": [ {"type": "hgroup","label": "0x00","meta": [{ "0": "" }],"items": [ {"type": "checkbox","label": "Bypass","address": "/GRANULATOR/0x00/Bypass","index": 0,"meta": [{ "0": "" },{ "tooltip": "When this is checked, the phaser   has no effect" }]}]},{"type": "hgroup","label": "0x00","meta": [{ "1": "" }],"items": [ {"type": "vslider","label": "decal","address": "/GRANULATOR/0x00/decal","index": 176432,"meta": [{ "BELA": "ANALOG_2" }],"init": 0,"min": 0,"max": 1,"step": 0.001},{"type": "vslider","label": "feedback","address": "/GRANULATOR/0x00/feedback","index": 176420,"meta": [{ "BELA": "ANALOG_4" }],"init": 0,"min": 0,"max": 2,"step": 0.001},{"type": "vslider","label": "population","address": "/GRANULATOR/0x00/population","index": 176440,"meta": [{ "BELA": "ANALOG_0" }],"init": 1,"min": 0,"max": 1,"step": 0.001},{"type": "vslider","label": "speed","address": "/GRANULATOR/0x00/speed","index": 176460,"meta": [{ "BELA": "ANALOG_3" }],"init": 1,"min": 0.125,"max": 4,"step": 0.001},{"type": "vslider","label": "taille","address": "/GRANULATOR/0x00/taille","index": 176436,"meta": [{ "BELA": "ANALOG_1" }],"init": 100,"min": 4,"max": 200,"step": 0.001}]}]}]}';
}
function getBase64Codegranulator() { return "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IjogMzUzMTAwLCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMiwibWV0YSI6IFsgeyAiYmFzaWNzLmxpYi9uYW1lIjogIkZhdXN0IEJhc2ljIEVsZW1lbnQgTGlicmFyeSIgfSx7ICJiYXNpY3MubGliL3ZlcnNpb24iOiAiMC4zIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWliIC1lcyAxIC1zaW5nbGUgLWZ0eiAyIiB9LHsgImZpbGVuYW1lIjogImdyYW51bGF0b3IuZHNwIiB9LHsgImZpbHRlcnMubGliL2RjYmxvY2tlcmF0OmF1dGhvciI6ICJKdWxpdXMgTy4gU21pdGggSUlJIiB9LHsgImZpbHRlcnMubGliL2RjYmxvY2tlcmF0OmNvcHlyaWdodCI6ICJDb3B5cmlnaHQgKEMpIDIwMDMtMjAxOSBieSBKdWxpdXMgTy4gU21pdGggSUlJIDxqb3NAY2NybWEuc3RhbmZvcmQuZWR1PiIgfSx7ICJmaWx0ZXJzLmxpYi9kY2Jsb2NrZXJhdDpsaWNlbnNlIjogIk1JVC1zdHlsZSBTVEstNC4zIGxpY2Vuc2UiIH0seyAiZmlsdGVycy5saWIvbG93cGFzczBfaGlnaHBhc3MxIjogIkNvcHlyaWdodCAoQykgMjAwMy0yMDE5IGJ5IEp1bGl1cyBPLiBTbWl0aCBJSUkgPGpvc0BjY3JtYS5zdGFuZm9yZC5lZHU+IiB9LHsgImZpbHRlcnMubGliL25hbWUiOiAiRmF1c3QgRmlsdGVycyBMaWJyYXJ5IiB9LHsgImZpbHRlcnMubGliL3BvbGU6YXV0aG9yIjogIkp1bGl1cyBPLiBTbWl0aCBJSUkiIH0seyAiZmlsdGVycy5saWIvcG9sZTpjb3B5cmlnaHQiOiAiQ29weXJpZ2h0IChDKSAyMDAzLTIwMTkgYnkgSnVsaXVzIE8uIFNtaXRoIElJSSA8am9zQGNjcm1hLnN0YW5mb3JkLmVkdT4iIH0seyAiZmlsdGVycy5saWIvcG9sZTpsaWNlbnNlIjogIk1JVC1zdHlsZSBTVEstNC4zIGxpY2Vuc2UiIH0seyAiZmlsdGVycy5saWIvdmVyc2lvbiI6ICIwLjMiIH0seyAiZmlsdGVycy5saWIvemVybzphdXRob3IiOiAiSnVsaXVzIE8uIFNtaXRoIElJSSIgfSx7ICJmaWx0ZXJzLmxpYi96ZXJvOmNvcHlyaWdodCI6ICJDb3B5cmlnaHQgKEMpIDIwMDMtMjAxOSBieSBKdWxpdXMgTy4gU21pdGggSUlJIDxqb3NAY2NybWEuc3RhbmZvcmQuZWR1PiIgfSx7ICJmaWx0ZXJzLmxpYi96ZXJvOmxpY2Vuc2UiOiAiTUlULXN0eWxlIFNUSy00LjMgbGljZW5zZSIgfSx7ICJtYXRocy5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXRocy5saWIvbmFtZSI6ICJGYXVzdCBNYXRoIExpYnJhcnkiIH0seyAibWF0aHMubGliL3ZlcnNpb24iOiAiMi41IiB9LHsgIm5hbWUiOiAiZ3JhbnVsYXRvciIgfSx7ICJwbGF0Zm9ybS5saWIvbmFtZSI6ICJHZW5lcmljIFBsYXRmb3JtIExpYnJhcnkiIH0seyAicGxhdGZvcm0ubGliL3ZlcnNpb24iOiAiMC4yIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJHUkFOVUxBVE9SIiwiaXRlbXMiOiBbIHsidHlwZSI6ICJoZ3JvdXAiLCJsYWJlbCI6ICIweDAwIiwibWV0YSI6IFt7ICIwIjogIiIgfV0sIml0ZW1zIjogWyB7InR5cGUiOiAiY2hlY2tib3giLCJsYWJlbCI6ICJCeXBhc3MiLCJhZGRyZXNzIjogIi9HUkFOVUxBVE9SLzB4MDAvQnlwYXNzIiwiaW5kZXgiOiAwLCJtZXRhIjogW3sgIjAiOiAiIiB9LHsgInRvb2x0aXAiOiAiV2hlbiB0aGlzIGlzIGNoZWNrZWQsIHRoZSBwaGFzZXIgICBoYXMgbm8gZWZmZWN0IiB9XX1dfSx7InR5cGUiOiAiaGdyb3VwIiwibGFiZWwiOiAiMHgwMCIsIm1ldGEiOiBbeyAiMSI6ICIiIH1dLCJpdGVtcyI6IFsgeyJ0eXBlIjogInZzbGlkZXIiLCJsYWJlbCI6ICJkZWNhbCIsImFkZHJlc3MiOiAiL0dSQU5VTEFUT1IvMHgwMC9kZWNhbCIsImluZGV4IjogMTc2NDMyLCJtZXRhIjogW3sgIkJFTEEiOiAiQU5BTE9HXzIiIH1dLCJpbml0IjogMCwibWluIjogMCwibWF4IjogMSwic3RlcCI6IDAuMDAxfSx7InR5cGUiOiAidnNsaWRlciIsImxhYmVsIjogImZlZWRiYWNrIiwiYWRkcmVzcyI6ICIvR1JBTlVMQVRPUi8weDAwL2ZlZWRiYWNrIiwiaW5kZXgiOiAxNzY0MjAsIm1ldGEiOiBbeyAiQkVMQSI6ICJBTkFMT0dfNCIgfV0sImluaXQiOiAwLCJtaW4iOiAwLCJtYXgiOiAyLCJzdGVwIjogMC4wMDF9LHsidHlwZSI6ICJ2c2xpZGVyIiwibGFiZWwiOiAicG9wdWxhdGlvbiIsImFkZHJlc3MiOiAiL0dSQU5VTEFUT1IvMHgwMC9wb3B1bGF0aW9uIiwiaW5kZXgiOiAxNzY0NDAsIm1ldGEiOiBbeyAiQkVMQSI6ICJBTkFMT0dfMCIgfV0sImluaXQiOiAxLCJtaW4iOiAwLCJtYXgiOiAxLCJzdGVwIjogMC4wMDF9LHsidHlwZSI6ICJ2c2xpZGVyIiwibGFiZWwiOiAic3BlZWQiLCJhZGRyZXNzIjogIi9HUkFOVUxBVE9SLzB4MDAvc3BlZWQiLCJpbmRleCI6IDE3NjQ2MCwibWV0YSI6IFt7ICJCRUxBIjogIkFOQUxPR18zIiB9XSwiaW5pdCI6IDEsIm1pbiI6IDAuMTI1LCJtYXgiOiA0LCJzdGVwIjogMC4wMDF9LHsidHlwZSI6ICJ2c2xpZGVyIiwibGFiZWwiOiAidGFpbGxlIiwiYWRkcmVzcyI6ICIvR1JBTlVMQVRPUi8weDAwL3RhaWxsZSIsImluZGV4IjogMTc2NDM2LCJtZXRhIjogW3sgIkJFTEEiOiAiQU5BTE9HXzEiIH1dLCJpbml0IjogMTAwLCJtaW4iOiA0LCJtYXgiOiAyMDAsInN0ZXAiOiAwLjAwMX1dfV19XX0="; }

/*
 faust2wasm: GRAME 2017-2019
*/

'use strict';

// Monophonic Faust DSP
class granulatorProcessor extends AudioWorkletProcessor {

    // JSON parsing functions
    static parse_ui(ui, obj, callback) {
        for (var i = 0; i < ui.length; i++) {
            granulatorProcessor.parse_group(ui[i], obj, callback);
        }
    }

    static parse_group(group, obj, callback) {
        if (group.items) {
            granulatorProcessor.parse_items(group.items, obj, callback);
        }
    }

    static parse_items(items, obj, callback) {
        for (var i = 0; i < items.length; i++) {
            callback(items[i], obj, callback);
        }
    }

    static parse_item1(item, obj, callback) {
        if (item.type === "vgroup"
            || item.type === "hgroup"
            || item.type === "tgroup") {
            granulatorProcessor.parse_items(item.items, obj, callback);
        } else if (item.type === "hbargraph"
            || item.type === "vbargraph") {
            // Nothing
        } else if (item.type === "vslider"
            || item.type === "hslider"
            || item.type === "button"
            || item.type === "checkbox"
            || item.type === "nentry") {
            obj.push({
                name: item.address,
                defaultValue: item.init,
                minValue: item.min,
                maxValue: item.max
            });
        }
    }

    static parse_item2(item, obj, callback) {
        if (item.type === "vgroup"
            || item.type === "hgroup"
            || item.type === "tgroup") {
            granulatorProcessor.parse_items(item.items, obj, callback);
        } else if (item.type === "hbargraph"
            || item.type === "vbargraph") {
            // Keep bargraph adresses
            obj.outputs_items.push(item.address);
            obj.pathTable[item.address] = parseInt(item.index);
        } else if (item.type === "soundfile") {
            // Keep soundfile adresses
            obj.soundfile_items.push(item.address);
            obj.pathTable[item.address] = parseInt(item.index);
        } else if (item.type === "vslider"
            || item.type === "hslider"
            || item.type === "button"
            || item.type === "checkbox"
            || item.type === "nentry") {
            // Keep inputs adresses
            obj.inputs_items.push(item.address);
            obj.pathTable[item.address] = parseInt(item.index);
        }
    }

    static get parameterDescriptors() {
        // Analyse JSON to generate AudioParam parameters
        var params = [];
        granulatorProcessor.parse_ui(JSON.parse(getJSONgranulator()).ui, params, granulatorProcessor.parse_item1);
        return params;
    }

    constructor(options) {
        super(options);
        this.running = true;

        const importObject = {
            env: {
                memoryBase: 0,
                tableBase: 0,

                // Integer version
                _abs: Math.abs,

                // Float version
                _acosf: Math.acos,
                _asinf: Math.asin,
                _atanf: Math.atan,
                _atan2f: Math.atan2,
                _ceilf: Math.ceil,
                _cosf: Math.cos,
                _expf: Math.exp,
                _floorf: Math.floor,
                _fmodf: function (x, y) { return x % y; },
                _logf: Math.log,
                _log10f: Math.log10,
                _max_f: Math.max,
                _min_f: Math.min,
                _remainderf: function (x, y) { return x - Math.round(x / y) * y; },
                _powf: Math.pow,
                _roundf: Math.fround,
                _sinf: Math.sin,
                _sqrtf: Math.sqrt,
                _tanf: Math.tan,
                _acoshf: Math.acosh,
                _asinhf: Math.asinh,
                _atanhf: Math.atanh,
                _coshf: Math.cosh,
                _sinhf: Math.sinh,
                _tanhf: Math.tanh,
                _isnanf: Number.isNaN,
                _isinff: function (x) { return !isFinite(x); },
                _copysignf: function (x, y) { return Math.sign(x) === Math.sign(y) ? x : -x; },

                // Double version
                _acos: Math.acos,
                _asin: Math.asin,
                _atan: Math.atan,
                _atan2: Math.atan2,
                _ceil: Math.ceil,
                _cos: Math.cos,
                _exp: Math.exp,
                _floor: Math.floor,
                _fmod: function (x, y) { return x % y; },
                _log: Math.log,
                _log10: Math.log10,
                _max_: Math.max,
                _min_: Math.min,
                _remainder: function (x, y) { return x - Math.round(x / y) * y; },
                _pow: Math.pow,
                _round: Math.fround,
                _sin: Math.sin,
                _sqrt: Math.sqrt,
                _tan: Math.tan,
                _acosh: Math.acosh,
                _asinh: Math.asinh,
                _atanh: Math.atanh,
                _cosh: Math.cosh,
                _sinh: Math.sinh,
                _tanh: Math.tanh,
                _isnan: Number.isNaN,
                _isinf: function (x) { return !isFinite(x); },
                _copysign: function (x, y) { return Math.sign(x) === Math.sign(y) ? x : -x; },

                table: new WebAssembly.Table({ initial: 0, element: 'anyfunc' })
            }
        };

        this.granulator_instance = new WebAssembly.Instance(options.processorOptions.wasm_module, importObject);
        this.json_object = JSON.parse(options.processorOptions.json);

        this.output_handler = function (path, value) { this.port.postMessage({ path: path, value: value }); };

        this.ins = null;
        this.outs = null;

        this.dspInChannnels = [];
        this.dspOutChannnels = [];

        this.numIn = parseInt(this.json_object.inputs);
        this.numOut = parseInt(this.json_object.outputs);

        // Memory allocator
        this.ptr_size = 4;
        this.sample_size = 4;
        this.integer_size = 4;

        this.factory = this.granulator_instance.exports;
        this.HEAP = this.granulator_instance.exports.memory.buffer;
        this.HEAP32 = new Int32Array(this.HEAP);
        this.HEAPF32 = new Float32Array(this.HEAP);

        // Warning: keeps a ref on HEAP in Chrome and prevent proper GC
        //console.log(this.HEAP);
        //console.log(this.HEAP32);
        //console.log(this.HEAPF32);

        // bargraph
        this.outputs_timer = 5;
        this.outputs_items = [];

        // input items
        this.inputs_items = [];

        // soundfile items
        this.soundfile_items = [];

        // Start of HEAP index

        // DSP is placed first with index 0. Audio buffer start at the end of DSP.
        this.audio_heap_ptr = parseInt(this.json_object.size);

        // Setup pointers offset
        this.audio_heap_ptr_inputs = this.audio_heap_ptr;
        this.audio_heap_ptr_outputs = this.audio_heap_ptr_inputs + (this.numIn * this.ptr_size);

        // Setup buffer offset
        this.audio_heap_inputs = this.audio_heap_ptr_outputs + (this.numOut * this.ptr_size);
        this.audio_heap_outputs = this.audio_heap_inputs + (this.numIn * NUM_FRAMES * this.sample_size);

        // Start of DSP memory : DSP is placed first with index 0
        this.dsp = 0;

        this.pathTable = [];

        // Send output values to the AudioNode
        this.update_outputs = function () {
            if (this.outputs_items.length > 0 && this.output_handler && this.outputs_timer-- === 0) {
                this.outputs_timer = 5;
                for (var i = 0; i < this.outputs_items.length; i++) {
                    this.output_handler(this.outputs_items[i], this.HEAPF32[this.pathTable[this.outputs_items[i]] >> 2]);
                }
            }
        }

        this.initAux = function () {
            var i;

            if (this.numIn > 0) {
                this.ins = this.audio_heap_ptr_inputs;
                for (i = 0; i < this.numIn; i++) {
                    this.HEAP32[(this.ins >> 2) + i] = this.audio_heap_inputs + ((NUM_FRAMES * this.sample_size) * i);
                }

                // Prepare Ins buffer tables
                var dspInChans = this.HEAP32.subarray(this.ins >> 2, (this.ins + this.numIn * this.ptr_size) >> 2);
                for (i = 0; i < this.numIn; i++) {
                    this.dspInChannnels[i] = this.HEAPF32.subarray(dspInChans[i] >> 2, (dspInChans[i] + NUM_FRAMES * this.sample_size) >> 2);
                }
            }

            if (this.numOut > 0) {
                this.outs = this.audio_heap_ptr_outputs;
                for (i = 0; i < this.numOut; i++) {
                    this.HEAP32[(this.outs >> 2) + i] = this.audio_heap_outputs + ((NUM_FRAMES * this.sample_size) * i);
                }

                // Prepare Out buffer tables
                var dspOutChans = this.HEAP32.subarray(this.outs >> 2, (this.outs + this.numOut * this.ptr_size) >> 2);
                for (i = 0; i < this.numOut; i++) {
                    this.dspOutChannnels[i] = this.HEAPF32.subarray(dspOutChans[i] >> 2, (dspOutChans[i] + NUM_FRAMES * this.sample_size) >> 2);
                }
            }

            // Parse UI
            granulatorProcessor.parse_ui(this.json_object.ui, this, granulatorProcessor.parse_item2);

            // Init DSP
            this.factory.init(this.dsp, sampleRate); // 'sampleRate' is defined in AudioWorkletGlobalScope  
        }

        this.setParamValue = function (path, val) {
            this.HEAPF32[this.pathTable[path] >> 2] = val;
        }

        this.getParamValue = function (path) {
            return this.HEAPF32[this.pathTable[path] >> 2];
        }

        // Init resulting DSP
        this.initAux();
        console.log(this);
    }

    handleMessage(event) {
        var msg = event.data;
        switch (msg.type) {
            case "destroy": this.running = false; break;
        }
    }

    process(inputs, outputs, parameters) {
        var input = inputs[0];
        var output = outputs[0];

        // Check inputs
        if (this.numIn > 0 && (!input || !input[0] || input[0].length === 0)) {
            //console.log("Process input error");
            return true;
        }
        // Check outputs
        if (this.numOut > 0 && (!output || !output[0] || output[0].length === 0)) {
            //console.log("Process output error");
            return true;
        }

        // Copy inputs
        if (input !== undefined) {
            for (var chan = 0; chan < Math.min(this.numIn, input.length); ++chan) {
                var dspInput = this.dspInChannnels[chan];
                dspInput.set(input[chan]);
            }
        }

        /*
        TODO: sample accurate control change is not yet handled
        When no automation occurs, params[i][1] has a length of 1,
        otherwise params[i][1] has a length of NUM_FRAMES with possible control change each sample
        */

        // Update controls
        for (const path in parameters) {
            const paramArray = parameters[path];
            this.setParamValue(path, paramArray[0]);
        }

        // Compute
        try {
            this.factory.compute(this.dsp, NUM_FRAMES, this.ins, this.outs);
        } catch (e) {
            console.log("ERROR in compute (" + e + ")");
        }

        // Update bargraph
        this.update_outputs();

        // Copy outputs
        if (output !== undefined) {
            for (var chan = 0; chan < Math.min(this.numOut, output.length); ++chan) {
                var dspOutput = this.dspOutChannnels[chan];
                output[chan].set(dspOutput);
            }
        }

        return this.running;
    }
}

// Globals
const NUM_FRAMES = 128;
try {
    registerProcessor('granulator', granulatorProcessor);
} catch (error) {
    console.warn(error);
}
