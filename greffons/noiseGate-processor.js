
/*
Code generated with Faust version 2.38.8
Compilation options: -lang wasm-ib -es 1 -single -ftz 2
*/

function getJSONnoiseGate() {
	return '{"name": "noiseGate","filename": "noiseGate.dsp","version": "2.38.8","compile_options": "-lang wasm-ib -es 1 -single -ftz 2","library_list": ["/usr/local/share/faust/stdfaust.lib","/usr/local/share/faust/demos.lib","/usr/local/share/faust/basics.lib","/usr/local/share/faust/routes.lib","/usr/local/share/faust/maths.lib","/usr/local/share/faust/platform.lib","/usr/local/share/faust/misceffects.lib","/usr/local/share/faust/analyzers.lib","/usr/local/share/faust/signals.lib"],"include_pathnames": ["/usr/local/share/faust","/usr/local/share/faust","/usr/share/faust",".","/home/dominique/public_html/notateur/faust/gate"],"size": 116,"inputs": 2,"outputs": 2,"meta": [ { "analyzers.lib/name": "Faust Analyzer Library" },{ "analyzers.lib/version": "0.1" },{ "author": "JOS, revised by RM" },{ "basics.lib/name": "Faust Basic Element Library" },{ "basics.lib/version": "0.3" },{ "compile_options": "-lang wasm-ib -es 1 -single -ftz 2" },{ "demos.lib/name": "Faust Demos Library" },{ "demos.lib/version": "0.1" },{ "description": "Gate demo application." },{ "filename": "noiseGate.dsp" },{ "maths.lib/author": "GRAME" },{ "maths.lib/copyright": "GRAME" },{ "maths.lib/license": "LGPL with exception" },{ "maths.lib/name": "Faust Math Library" },{ "maths.lib/version": "2.5" },{ "misceffects.lib/name": "Misc Effects Library" },{ "misceffects.lib/version": "2.0" },{ "name": "noiseGate" },{ "platform.lib/name": "Generic Platform Library" },{ "platform.lib/version": "0.2" },{ "routes.lib/name": "Faust Signal Routing Library" },{ "routes.lib/version": "0.2" },{ "signals.lib/name": "Faust Signal Routing Library" },{ "signals.lib/version": "0.1" },{ "version": "0.0" }],"ui": [ {"type": "vgroup","label": "GATE","meta": [{ "tooltip": "Reference:         http://en.wikipedia.org/wiki/Noise_gate" }],"items": [ {"type": "hgroup","label": "0x00","meta": [{ "0": "" }],"items": [ {"type": "checkbox","label": "Bypass","address": "/GATE/0x00/Bypass","index": 0,"meta": [{ "0": "" },{ "tooltip": "When this is checked,         the gate has no effect" }]},{"type": "hbargraph","label": "Gate Gain","address": "/GATE/0x00/Gate Gain","index": 72,"meta": [{ "1": "" },{ "tooltip": "Current gain of the     gate in dB" },{ "unit": "dB" }],"min": -50,"max": 10}]},{"type": "hgroup","label": "0x00","meta": [{ "1": "" }],"items": [ {"type": "hslider","label": "Threshold","address": "/GATE/0x00/Threshold","index": 32,"meta": [{ "1": "" },{ "style": "knob" },{ "tooltip": "When         the signal level falls below the Threshold (expressed in dB), the signal is         muted" },{ "unit": "dB" }],"init": -30,"min": -120,"max": 0,"step": 0.1},{"type": "hslider","label": "Attack","address": "/GATE/0x00/Attack","index": 16,"meta": [{ "2": "" },{ "scale": "log" },{ "style": "knob" },{ "tooltip": "Time constant in MICROseconds (1/e smoothing time) for the gate     gain to go (exponentially) from 0 (muted) to 1 (unmuted)" },{ "unit": "us" }],"init": 10,"min": 10,"max": 10000,"step": 1},{"type": "hslider","label": "Hold","address": "/GATE/0x00/Hold","index": 44,"meta": [{ "3": "" },{ "scale": "log" },{ "style": "knob" },{ "tooltip": "Time in ms to keep the gate open (no muting) after the signal     level falls below the Threshold" },{ "unit": "ms" }],"init": 200,"min": 1,"max": 1000,"step": 1},{"type": "hslider","label": "Release","address": "/GATE/0x00/Release","index": 20,"meta": [{ "4": "" },{ "scale": "log" },{ "style": "knob" },{ "tooltip": "Time constant in ms (1/e smoothing time) for the gain to go     (exponentially) from 1 (unmuted) to 0 (muted)" },{ "unit": "ms" }],"init": 100,"min": 1,"max": 1000,"step": 1}]}]}]}';
}
function getBase64CodenoiseGate() { return "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YXJlL2ZhdXN0L3N0ZGZhdXN0LmxpYiIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QvZGVtb3MubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9iYXNpY3MubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9yb3V0ZXMubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9tYXRocy5saWIiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0L3BsYXRmb3JtLmxpYiIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QvbWlzY2VmZmVjdHMubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9hbmFseXplcnMubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9zaWduYWxzLmxpYiJdLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiIsIi9ob21lL2RvbWluaXF1ZS9wdWJsaWNfaHRtbC9ub3RhdGV1ci9mYXVzdC9nYXRlIl0sInNpemUiOiAxMTYsImlucHV0cyI6IDIsIm91dHB1dHMiOiAyLCJtZXRhIjogWyB7ICJhbmFseXplcnMubGliL25hbWUiOiAiRmF1c3QgQW5hbHl6ZXIgTGlicmFyeSIgfSx7ICJhbmFseXplcnMubGliL3ZlcnNpb24iOiAiMC4xIiB9LHsgImF1dGhvciI6ICJKT1MsIHJldmlzZWQgYnkgUk0iIH0seyAiYmFzaWNzLmxpYi9uYW1lIjogIkZhdXN0IEJhc2ljIEVsZW1lbnQgTGlicmFyeSIgfSx7ICJiYXNpY3MubGliL3ZlcnNpb24iOiAiMC4zIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWliIC1lcyAxIC1zaW5nbGUgLWZ0eiAyIiB9LHsgImRlbW9zLmxpYi9uYW1lIjogIkZhdXN0IERlbW9zIExpYnJhcnkiIH0seyAiZGVtb3MubGliL3ZlcnNpb24iOiAiMC4xIiB9LHsgImRlc2NyaXB0aW9uIjogIkdhdGUgZGVtbyBhcHBsaWNhdGlvbi4iIH0seyAiZmlsZW5hbWUiOiAibm9pc2VHYXRlLmRzcCIgfSx7ICJtYXRocy5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXRocy5saWIvbmFtZSI6ICJGYXVzdCBNYXRoIExpYnJhcnkiIH0seyAibWF0aHMubGliL3ZlcnNpb24iOiAiMi41IiB9LHsgIm1pc2NlZmZlY3RzLmxpYi9uYW1lIjogIk1pc2MgRWZmZWN0cyBMaWJyYXJ5IiB9LHsgIm1pc2NlZmZlY3RzLmxpYi92ZXJzaW9uIjogIjIuMCIgfSx7ICJuYW1lIjogIm5vaXNlR2F0ZSIgfSx7ICJwbGF0Zm9ybS5saWIvbmFtZSI6ICJHZW5lcmljIFBsYXRmb3JtIExpYnJhcnkiIH0seyAicGxhdGZvcm0ubGliL3ZlcnNpb24iOiAiMC4yIiB9LHsgInJvdXRlcy5saWIvbmFtZSI6ICJGYXVzdCBTaWduYWwgUm91dGluZyBMaWJyYXJ5IiB9LHsgInJvdXRlcy5saWIvdmVyc2lvbiI6ICIwLjIiIH0seyAic2lnbmFscy5saWIvbmFtZSI6ICJGYXVzdCBTaWduYWwgUm91dGluZyBMaWJyYXJ5IiB9LHsgInNpZ25hbHMubGliL3ZlcnNpb24iOiAiMC4xIiB9LHsgInZlcnNpb24iOiAiMC4wIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJHQVRFIiwibWV0YSI6IFt7ICJ0b29sdGlwIjogIlJlZmVyZW5jZTogICAgICAgICBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL05vaXNlX2dhdGUiIH1dLCJpdGVtcyI6IFsgeyJ0eXBlIjogImhncm91cCIsImxhYmVsIjogIjB4MDAiLCJtZXRhIjogW3sgIjAiOiAiIiB9XSwiaXRlbXMiOiBbIHsidHlwZSI6ICJjaGVja2JveCIsImxhYmVsIjogIkJ5cGFzcyIsImFkZHJlc3MiOiAiL0dBVEUvMHgwMC9CeXBhc3MiLCJpbmRleCI6IDAsIm1ldGEiOiBbeyAiMCI6ICIiIH0seyAidG9vbHRpcCI6ICJXaGVuIHRoaXMgaXMgY2hlY2tlZCwgICAgICAgICB0aGUgZ2F0ZSBoYXMgbm8gZWZmZWN0IiB9XX0seyJ0eXBlIjogImhiYXJncmFwaCIsImxhYmVsIjogIkdhdGUgR2FpbiIsImFkZHJlc3MiOiAiL0dBVEUvMHgwMC9HYXRlIEdhaW4iLCJpbmRleCI6IDcyLCJtZXRhIjogW3sgIjEiOiAiIiB9LHsgInRvb2x0aXAiOiAiQ3VycmVudCBnYWluIG9mIHRoZSAgICAgZ2F0ZSBpbiBkQiIgfSx7ICJ1bml0IjogImRCIiB9XSwibWluIjogLTUwLCJtYXgiOiAxMH1dfSx7InR5cGUiOiAiaGdyb3VwIiwibGFiZWwiOiAiMHgwMCIsIm1ldGEiOiBbeyAiMSI6ICIiIH1dLCJpdGVtcyI6IFsgeyJ0eXBlIjogImhzbGlkZXIiLCJsYWJlbCI6ICJUaHJlc2hvbGQiLCJhZGRyZXNzIjogIi9HQVRFLzB4MDAvVGhyZXNob2xkIiwiaW5kZXgiOiAzMiwibWV0YSI6IFt7ICIxIjogIiIgfSx7ICJzdHlsZSI6ICJrbm9iIiB9LHsgInRvb2x0aXAiOiAiV2hlbiAgICAgICAgIHRoZSBzaWduYWwgbGV2ZWwgZmFsbHMgYmVsb3cgdGhlIFRocmVzaG9sZCAoZXhwcmVzc2VkIGluIGRCKSwgdGhlIHNpZ25hbCBpcyAgICAgICAgIG11dGVkIiB9LHsgInVuaXQiOiAiZEIiIH1dLCJpbml0IjogLTMwLCJtaW4iOiAtMTIwLCJtYXgiOiAwLCJzdGVwIjogMC4xfSx7InR5cGUiOiAiaHNsaWRlciIsImxhYmVsIjogIkF0dGFjayIsImFkZHJlc3MiOiAiL0dBVEUvMHgwMC9BdHRhY2siLCJpbmRleCI6IDE2LCJtZXRhIjogW3sgIjIiOiAiIiB9LHsgInNjYWxlIjogImxvZyIgfSx7ICJzdHlsZSI6ICJrbm9iIiB9LHsgInRvb2x0aXAiOiAiVGltZSBjb25zdGFudCBpbiBNSUNST3NlY29uZHMgKDEvZSBzbW9vdGhpbmcgdGltZSkgZm9yIHRoZSBnYXRlICAgICBnYWluIHRvIGdvIChleHBvbmVudGlhbGx5KSBmcm9tIDAgKG11dGVkKSB0byAxICh1bm11dGVkKSIgfSx7ICJ1bml0IjogInVzIiB9XSwiaW5pdCI6IDEwLCJtaW4iOiAxMCwibWF4IjogMTAwMDAsInN0ZXAiOiAxfSx7InR5cGUiOiAiaHNsaWRlciIsImxhYmVsIjogIkhvbGQiLCJhZGRyZXNzIjogIi9HQVRFLzB4MDAvSG9sZCIsImluZGV4IjogNDQsIm1ldGEiOiBbeyAiMyI6ICIiIH0seyAic2NhbGUiOiAibG9nIiB9LHsgInN0eWxlIjogImtub2IiIH0seyAidG9vbHRpcCI6ICJUaW1lIGluIG1zIHRvIGtlZXAgdGhlIGdhdGUgb3BlbiAobm8gbXV0aW5nKSBhZnRlciB0aGUgc2lnbmFsICAgICBsZXZlbCBmYWxscyBiZWxvdyB0aGUgVGhyZXNob2xkIiB9LHsgInVuaXQiOiAibXMiIH1dLCJpbml0IjogMjAwLCJtaW4iOiAxLCJtYXgiOiAxMDAwLCJzdGVwIjogMX0seyJ0eXBlIjogImhzbGlkZXIiLCJsYWJlbCI6ICJSZWxlYXNlIiwiYWRkcmVzcyI6ICIvR0FURS8weDAwL1JlbGVhc2UiLCJpbmRleCI6IDIwLCJtZXRhIjogW3sgIjQiOiAiIiB9LHsgInNjYWxlIjogImxvZyIgfSx7ICJzdHlsZSI6ICJrbm9iIiB9LHsgInRvb2x0aXAiOiAiVGltZSBjb25zdGFudCBpbiBtcyAoMS9lIHNtb290aGluZyB0aW1lKSBmb3IgdGhlIGdhaW4gdG8gZ28gICAgIChleHBvbmVudGlhbGx5KSBmcm9tIDEgKHVubXV0ZWQpIHRvIDAgKG11dGVkKSIgfSx7ICJ1bml0IjogIm1zIiB9XSwiaW5pdCI6IDEwMCwibWluIjogMSwibWF4IjogMTAwMCwic3RlcCI6IDF9XX1dfV19"; }

/*
 faust2wasm: GRAME 2017-2019
*/

'use strict';

// Monophonic Faust DSP
class noiseGateProcessor extends AudioWorkletProcessor {

    // JSON parsing functions
    static parse_ui(ui, obj, callback) {
        for (var i = 0; i < ui.length; i++) {
            noiseGateProcessor.parse_group(ui[i], obj, callback);
        }
    }

    static parse_group(group, obj, callback) {
        if (group.items) {
            noiseGateProcessor.parse_items(group.items, obj, callback);
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
            noiseGateProcessor.parse_items(item.items, obj, callback);
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
            noiseGateProcessor.parse_items(item.items, obj, callback);
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
        noiseGateProcessor.parse_ui(JSON.parse(getJSONnoiseGate()).ui, params, noiseGateProcessor.parse_item1);
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

        this.noiseGate_instance = new WebAssembly.Instance(options.processorOptions.wasm_module, importObject);
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

        this.factory = this.noiseGate_instance.exports;
        this.HEAP = this.noiseGate_instance.exports.memory.buffer;
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
            noiseGateProcessor.parse_ui(this.json_object.ui, this, noiseGateProcessor.parse_item2);

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
    registerProcessor('noiseGate', noiseGateProcessor);
} catch (error) {
    console.warn(error);
}
