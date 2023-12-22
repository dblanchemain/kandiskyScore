
/*
Code generated with Faust version 2.38.8
Compilation options: -lang wasm-ib -es 1 -single -ftz 2
*/

function getJSONfreeverb() {
	return '{"name": "freeverb","filename": "freeverb.dsp","version": "2.38.8","compile_options": "-lang wasm-ib -es 1 -single -ftz 2","library_list": ["/usr/local/share/faust/stdfaust.lib","/usr/local/share/faust/demos.lib","/usr/local/share/faust/maths.lib","/usr/local/share/faust/platform.lib","/usr/local/share/faust/reverbs.lib","/usr/local/share/faust/filters.lib","/usr/local/share/faust/delays.lib"],"include_pathnames": ["/usr/local/share/faust","/usr/local/share/faust","/usr/share/faust",".","/home/dominique/public_html/notateur/faust/freeverb"],"size": 586148,"inputs": 2,"outputs": 2,"meta": [ { "author": "RM" },{ "compile_options": "-lang wasm-ib -es 1 -single -ftz 2" },{ "delays.lib/name": "Faust Delay Library" },{ "delays.lib/version": "0.1" },{ "demos.lib/name": "Faust Demos Library" },{ "demos.lib/version": "0.1" },{ "description": "Freeverb demo application." },{ "filename": "freeverb.dsp" },{ "filters.lib/allpass_comb:author": "Julius O. Smith III" },{ "filters.lib/allpass_comb:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/allpass_comb:license": "MIT-style STK-4.3 license" },{ "filters.lib/lowpass0_highpass1": "MIT-style STK-4.3 license" },{ "filters.lib/name": "Faust Filters Library" },{ "filters.lib/version": "0.3" },{ "maths.lib/author": "GRAME" },{ "maths.lib/copyright": "GRAME" },{ "maths.lib/license": "LGPL with exception" },{ "maths.lib/name": "Faust Math Library" },{ "maths.lib/version": "2.5" },{ "name": "freeverb" },{ "platform.lib/name": "Generic Platform Library" },{ "platform.lib/version": "0.2" },{ "reverbs.lib/name": "Faust Reverb Library" },{ "reverbs.lib/version": "0.2" },{ "version": "0.0" }],"ui": [ {"type": "hgroup","label": "Freeverb","items": [ {"type": "vgroup","label": "0x00","meta": [{ "0": "" }],"items": [ {"type": "vslider","label": "Damp","address": "/Freeverb/0x00/Damp","index": 16,"meta": [{ "0": "" },{ "style": "knob" },{ "tooltip": "Somehow control the         density of the reverb." }],"init": 0.5,"min": 0,"max": 1,"step": 0.025},{"type": "vslider","label": "RoomSize","address": "/Freeverb/0x00/RoomSize","index": 8,"meta": [{ "1": "" },{ "style": "knob" },{ "tooltip": "The room size         between 0 and 1 with 1 for the largest room." }],"init": 0.5,"min": 0,"max": 1,"step": 0.025},{"type": "vslider","label": "Stereo Spread","address": "/Freeverb/0x00/Stereo Spread","index": 323848,"meta": [{ "2": "" },{ "style": "knob" },{ "tooltip": "Spatial         spread between 0 and 1 with 1 for maximum spread." }],"init": 0.5,"min": 0,"max": 1,"step": 0.01}]},{"type": "vslider","label": "Wet","address": "/Freeverb/Wet","index": 28,"meta": [{ "1": "" },{ "tooltip": "The amount of reverb applied to the signal         between 0 and 1 with 1 for the maximum amount of reverb." }],"init": 0.3333,"min": 0,"max": 1,"step": 0.025}]}]}';
}
function getBase64Codefreeverb() { return "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IAKUqDYCvMEQQQBBgAhBAEEAKAK8wRBBf2oQCxAMNgLAwRBBAEMK1yM8IAKUqDYCzIERQQBBgAhBAEEAKALMgRFBf2oQCxAMNgLQgRFBAENLYP07IAKUqDYC3MERQQBBgAhBAEEAKALcwRFBf2oQCxAMNgLgwRFBAEMFL6c7IAKUqDYC7OERQQBBgAhBAEEAKALs4RFBf2oQCxAMNgLw4RFBAEMWuIg6IAKUOAKE4hMLkICAgAAAIAAgARAIIAAQCiAAEAcLrICAgAAAQQBDAAAAPzgCCEEAQwAAAD84AhBBAENMpqo+OAIcQQBDAAAAPzgCiOITC5CAgIAAACAAIAFIBH8gAQUgAAsPC5CAgIAAACAAIAFIBH8gAAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC7KWgIAAAQBBAAurFnsibmFtZSI6ICJmcmVldmVyYiIsImZpbGVuYW1lIjogImZyZWV2ZXJiLmRzcCIsInZlcnNpb24iOiAiMi4zOC44IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taWIgLWVzIDEgLXNpbmdsZSAtZnR6IDIiLCJsaWJyYXJ5X2xpc3QiOiBbIi91c3IvbG9jYWwvc2hhcmUvZmF1c3Qvc3RkZmF1c3QubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9kZW1vcy5saWIiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0L21hdGhzLmxpYiIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QvcGxhdGZvcm0ubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9yZXZlcmJzLmxpYiIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QvZmlsdGVycy5saWIiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0L2RlbGF5cy5saWIiXSwiaW5jbHVkZV9wYXRobmFtZXMiOiBbIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9zaGFyZS9mYXVzdCIsIi4iLCIvaG9tZS9kb21pbmlxdWUvcHVibGljX2h0bWwvbm90YXRldXIvZmF1c3QvZnJlZXZlcmIiXSwic2l6ZSI6IDU4NjE0OCwiaW5wdXRzIjogMiwib3V0cHV0cyI6IDIsIm1ldGEiOiBbIHsgImF1dGhvciI6ICJSTSIgfSx7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pYiAtZXMgMSAtc2luZ2xlIC1mdHogMiIgfSx7ICJkZWxheXMubGliL25hbWUiOiAiRmF1c3QgRGVsYXkgTGlicmFyeSIgfSx7ICJkZWxheXMubGliL3ZlcnNpb24iOiAiMC4xIiB9LHsgImRlbW9zLmxpYi9uYW1lIjogIkZhdXN0IERlbW9zIExpYnJhcnkiIH0seyAiZGVtb3MubGliL3ZlcnNpb24iOiAiMC4xIiB9LHsgImRlc2NyaXB0aW9uIjogIkZyZWV2ZXJiIGRlbW8gYXBwbGljYXRpb24uIiB9LHsgImZpbGVuYW1lIjogImZyZWV2ZXJiLmRzcCIgfSx7ICJmaWx0ZXJzLmxpYi9hbGxwYXNzX2NvbWI6YXV0aG9yIjogIkp1bGl1cyBPLiBTbWl0aCBJSUkiIH0seyAiZmlsdGVycy5saWIvYWxscGFzc19jb21iOmNvcHlyaWdodCI6ICJDb3B5cmlnaHQgKEMpIDIwMDMtMjAxOSBieSBKdWxpdXMgTy4gU21pdGggSUlJIDxqb3NAY2NybWEuc3RhbmZvcmQuZWR1PiIgfSx7ICJmaWx0ZXJzLmxpYi9hbGxwYXNzX2NvbWI6bGljZW5zZSI6ICJNSVQtc3R5bGUgU1RLLTQuMyBsaWNlbnNlIiB9LHsgImZpbHRlcnMubGliL2xvd3Bhc3MwX2hpZ2hwYXNzMSI6ICJNSVQtc3R5bGUgU1RLLTQuMyBsaWNlbnNlIiB9LHsgImZpbHRlcnMubGliL25hbWUiOiAiRmF1c3QgRmlsdGVycyBMaWJyYXJ5IiB9LHsgImZpbHRlcnMubGliL3ZlcnNpb24iOiAiMC4zIiB9LHsgIm1hdGhzLmxpYi9hdXRob3IiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgIm1hdGhzLmxpYi9uYW1lIjogIkZhdXN0IE1hdGggTGlicmFyeSIgfSx7ICJtYXRocy5saWIvdmVyc2lvbiI6ICIyLjUiIH0seyAibmFtZSI6ICJmcmVldmVyYiIgfSx7ICJwbGF0Zm9ybS5saWIvbmFtZSI6ICJHZW5lcmljIFBsYXRmb3JtIExpYnJhcnkiIH0seyAicGxhdGZvcm0ubGliL3ZlcnNpb24iOiAiMC4yIiB9LHsgInJldmVyYnMubGliL25hbWUiOiAiRmF1c3QgUmV2ZXJiIExpYnJhcnkiIH0seyAicmV2ZXJicy5saWIvdmVyc2lvbiI6ICIwLjIiIH0seyAidmVyc2lvbiI6ICIwLjAiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogImhncm91cCIsImxhYmVsIjogIkZyZWV2ZXJiIiwiaXRlbXMiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICIweDAwIiwibWV0YSI6IFt7ICIwIjogIiIgfV0sIml0ZW1zIjogWyB7InR5cGUiOiAidnNsaWRlciIsImxhYmVsIjogIkRhbXAiLCJhZGRyZXNzIjogIi9GcmVldmVyYi8weDAwL0RhbXAiLCJpbmRleCI6IDE2LCJtZXRhIjogW3sgIjAiOiAiIiB9LHsgInN0eWxlIjogImtub2IiIH0seyAidG9vbHRpcCI6ICJTb21laG93IGNvbnRyb2wgdGhlICAgICAgICAgZGVuc2l0eSBvZiB0aGUgcmV2ZXJiLiIgfV0sImluaXQiOiAwLjUsIm1pbiI6IDAsIm1heCI6IDEsInN0ZXAiOiAwLjAyNX0seyJ0eXBlIjogInZzbGlkZXIiLCJsYWJlbCI6ICJSb29tU2l6ZSIsImFkZHJlc3MiOiAiL0ZyZWV2ZXJiLzB4MDAvUm9vbVNpemUiLCJpbmRleCI6IDgsIm1ldGEiOiBbeyAiMSI6ICIiIH0seyAic3R5bGUiOiAia25vYiIgfSx7ICJ0b29sdGlwIjogIlRoZSByb29tIHNpemUgICAgICAgICBiZXR3ZWVuIDAgYW5kIDEgd2l0aCAxIGZvciB0aGUgbGFyZ2VzdCByb29tLiIgfV0sImluaXQiOiAwLjUsIm1pbiI6IDAsIm1heCI6IDEsInN0ZXAiOiAwLjAyNX0seyJ0eXBlIjogInZzbGlkZXIiLCJsYWJlbCI6ICJTdGVyZW8gU3ByZWFkIiwiYWRkcmVzcyI6ICIvRnJlZXZlcmIvMHgwMC9TdGVyZW8gU3ByZWFkIiwiaW5kZXgiOiAzMjM4NDgsIm1ldGEiOiBbeyAiMiI6ICIiIH0seyAic3R5bGUiOiAia25vYiIgfSx7ICJ0b29sdGlwIjogIlNwYXRpYWwgICAgICAgICBzcHJlYWQgYmV0d2VlbiAwIGFuZCAxIHdpdGggMSBmb3IgbWF4aW11bSBzcHJlYWQuIiB9XSwiaW5pdCI6IDAuNSwibWluIjogMCwibWF4IjogMSwic3RlcCI6IDAuMDF9XX0seyJ0eXBlIjogInZzbGlkZXIiLCJsYWJlbCI6ICJXZXQiLCJhZGRyZXNzIjogIi9GcmVldmVyYi9XZXQiLCJpbmRleCI6IDI4LCJtZXRhIjogW3sgIjEiOiAiIiB9LHsgInRvb2x0aXAiOiAiVGhlIGFtb3VudCBvZiByZXZlcmIgYXBwbGllZCB0byB0aGUgc2lnbmFsICAgICAgICAgYmV0d2VlbiAwIGFuZCAxIHdpdGggMSBmb3IgdGhlIG1heGltdW0gYW1vdW50IG9mIHJldmVyYi4iIH1dLCJpbml0IjogMC4zMzMzLCJtaW4iOiAwLCJtYXgiOiAxLCJzdGVwIjogMC4wMjV9XX1dfQ=="; }

/*
 faust2wasm: GRAME 2017-2019
*/

'use strict';

// Monophonic Faust DSP
class freeverbProcessor extends AudioWorkletProcessor {

    // JSON parsing functions
    static parse_ui(ui, obj, callback) {
        for (var i = 0; i < ui.length; i++) {
            freeverbProcessor.parse_group(ui[i], obj, callback);
        }
    }

    static parse_group(group, obj, callback) {
        if (group.items) {
            freeverbProcessor.parse_items(group.items, obj, callback);
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
            freeverbProcessor.parse_items(item.items, obj, callback);
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
            freeverbProcessor.parse_items(item.items, obj, callback);
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
        freeverbProcessor.parse_ui(JSON.parse(getJSONfreeverb()).ui, params, freeverbProcessor.parse_item1);
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

        this.freeverb_instance = new WebAssembly.Instance(options.processorOptions.wasm_module, importObject);
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

        this.factory = this.freeverb_instance.exports;
        this.HEAP = this.freeverb_instance.exports.memory.buffer;
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
            freeverbProcessor.parse_ui(this.json_object.ui, this, freeverbProcessor.parse_item2);

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
    registerProcessor('freeverb', freeverbProcessor);
} catch (error) {
    console.warn(error);
}
