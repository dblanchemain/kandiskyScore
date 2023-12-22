
/*
Code generated with Faust version 2.38.8
Compilation options: -lang wasm-ib -es 1 -single -ftz 2
*/

function getJSONflanger() {
	return '{"name": "flanger","filename": "flanger.dsp","version": "2.38.8","compile_options": "-lang wasm-ib -es 1 -single -ftz 2","library_list": ["/usr/local/share/faust/stdfaust.lib","/usr/local/share/faust/demos.lib","/usr/local/share/faust/basics.lib","/usr/local/share/faust/routes.lib","/usr/local/share/faust/oscillators.lib","/usr/local/share/faust/filters.lib","/usr/local/share/faust/maths.lib","/usr/local/share/faust/platform.lib","/usr/local/share/faust/phaflangers.lib","/usr/local/share/faust/delays.lib"],"include_pathnames": ["/usr/local/share/faust","/usr/local/share/faust","/usr/share/faust",".","/home/dominique/public_html/notateur/faust/flanger"],"size": 32860,"inputs": 2,"outputs": 2,"meta": [ { "author": "JOS, revised by RM" },{ "basics.lib/name": "Faust Basic Element Library" },{ "basics.lib/version": "0.3" },{ "compile_options": "-lang wasm-ib -es 1 -single -ftz 2" },{ "delays.lib/name": "Faust Delay Library" },{ "delays.lib/version": "0.1" },{ "demos.lib/name": "Faust Demos Library" },{ "demos.lib/version": "0.1" },{ "description": "Flanger effect application." },{ "filename": "flanger.dsp" },{ "filters.lib/lowpass0_highpass1": "MIT-style STK-4.3 license" },{ "filters.lib/name": "Faust Filters Library" },{ "filters.lib/nlf2:author": "Julius O. Smith III" },{ "filters.lib/nlf2:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/nlf2:license": "MIT-style STK-4.3 license" },{ "filters.lib/version": "0.3" },{ "maths.lib/author": "GRAME" },{ "maths.lib/copyright": "GRAME" },{ "maths.lib/license": "LGPL with exception" },{ "maths.lib/name": "Faust Math Library" },{ "maths.lib/version": "2.5" },{ "name": "flanger" },{ "oscillators.lib/name": "Faust Oscillator Library" },{ "oscillators.lib/version": "0.3" },{ "phaflangers.lib/name": "Faust Phaser and Flanger Library" },{ "phaflangers.lib/version": "0.1" },{ "platform.lib/name": "Generic Platform Library" },{ "platform.lib/version": "0.2" },{ "routes.lib/name": "Faust Signal Routing Library" },{ "routes.lib/version": "0.2" },{ "version": "0.0" }],"ui": [ {"type": "vgroup","label": "FLANGER","meta": [{ "tooltip": "Reference: https://ccrma.stanford.edu/~jos/pasp/Flanging.html" }],"items": [ {"type": "hgroup","label": "0x00","meta": [{ "0": "" }],"items": [ {"type": "checkbox","label": "Bypass","address": "/FLANGER/0x00/Bypass","index": 0,"meta": [{ "0": "" },{ "tooltip": "When this is checked, the flanger         has no effect" }]},{"type": "checkbox","label": "Invert Flange Sum","address": "/FLANGER/0x00/Invert Flange Sum","index": 16460,"meta": [{ "1": "" }]},{"type": "hbargraph","label": "Flange LFO","address": "/FLANGER/0x00/Flange LFO","index": 48,"meta": [{ "2": "" },{ "style": "led" },{ "tooltip": "Display sum of flange delays" }],"min": -1.5,"max": 1.5}]},{"type": "hgroup","label": "0x00","meta": [{ "1": "" }],"items": [ {"type": "hslider","label": "Speed","address": "/FLANGER/0x00/Speed","index": 20,"meta": [{ "1": "" },{ "style": "knob" },{ "unit": "Hz" }],"init": 0.5,"min": 0,"max": 10,"step": 0.01},{"type": "hslider","label": "Depth","address": "/FLANGER/0x00/Depth","index": 16464,"meta": [{ "2": "" },{ "style": "knob" }],"init": 1,"min": 0,"max": 1,"step": 0.001},{"type": "hslider","label": "Feedback","address": "/FLANGER/0x00/Feedback","index": 52,"meta": [{ "3": "" },{ "style": "knob" }],"init": 0,"min": -0.999,"max": 0.999,"step": 0.001}]},{"type": "hgroup","label": "Delay Controls","meta": [{ "2": "" }],"items": [ {"type": "hslider","label": "Flange Delay","address": "/FLANGER/Delay Controls/Flange Delay","index": 16448,"meta": [{ "1": "" },{ "style": "knob" },{ "unit": "ms" }],"init": 10,"min": 0,"max": 20,"step": 0.001},{"type": "hslider","label": "Delay Offset","address": "/FLANGER/Delay Controls/Delay Offset","index": 16444,"meta": [{ "2": "" },{ "style": "knob" },{ "unit": "ms" }],"init": 1,"min": 0,"max": 20,"step": 0.001}]},{"type": "hgroup","label": "0x00","meta": [{ "3": "" }],"items": [ {"type": "hslider","label": "Flanger Output Level","address": "/FLANGER/0x00/Flanger Output Level","index": 4,"meta": [{ "unit": "dB" }],"init": 0,"min": -60,"max": 10,"step": 0.1}]}]}]}';
}
function getBase64Codeflanger() { return "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Y2FsL3NoYXJlL2ZhdXN0L3BsYXRmb3JtLmxpYiIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QvcGhhZmxhbmdlcnMubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9kZWxheXMubGliIl0sImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIiwiL2hvbWUvZG9taW5pcXVlL3B1YmxpY19odG1sL25vdGF0ZXVyL2ZhdXN0L2ZsYW5nZXIiXSwic2l6ZSI6IDMyODYwLCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMiwibWV0YSI6IFsgeyAiYXV0aG9yIjogIkpPUywgcmV2aXNlZCBieSBSTSIgfSx7ICJiYXNpY3MubGliL25hbWUiOiAiRmF1c3QgQmFzaWMgRWxlbWVudCBMaWJyYXJ5IiB9LHsgImJhc2ljcy5saWIvdmVyc2lvbiI6ICIwLjMiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taWIgLWVzIDEgLXNpbmdsZSAtZnR6IDIiIH0seyAiZGVsYXlzLmxpYi9uYW1lIjogIkZhdXN0IERlbGF5IExpYnJhcnkiIH0seyAiZGVsYXlzLmxpYi92ZXJzaW9uIjogIjAuMSIgfSx7ICJkZW1vcy5saWIvbmFtZSI6ICJGYXVzdCBEZW1vcyBMaWJyYXJ5IiB9LHsgImRlbW9zLmxpYi92ZXJzaW9uIjogIjAuMSIgfSx7ICJkZXNjcmlwdGlvbiI6ICJGbGFuZ2VyIGVmZmVjdCBhcHBsaWNhdGlvbi4iIH0seyAiZmlsZW5hbWUiOiAiZmxhbmdlci5kc3AiIH0seyAiZmlsdGVycy5saWIvbG93cGFzczBfaGlnaHBhc3MxIjogIk1JVC1zdHlsZSBTVEstNC4zIGxpY2Vuc2UiIH0seyAiZmlsdGVycy5saWIvbmFtZSI6ICJGYXVzdCBGaWx0ZXJzIExpYnJhcnkiIH0seyAiZmlsdGVycy5saWIvbmxmMjphdXRob3IiOiAiSnVsaXVzIE8uIFNtaXRoIElJSSIgfSx7ICJmaWx0ZXJzLmxpYi9ubGYyOmNvcHlyaWdodCI6ICJDb3B5cmlnaHQgKEMpIDIwMDMtMjAxOSBieSBKdWxpdXMgTy4gU21pdGggSUlJIDxqb3NAY2NybWEuc3RhbmZvcmQuZWR1PiIgfSx7ICJmaWx0ZXJzLmxpYi9ubGYyOmxpY2Vuc2UiOiAiTUlULXN0eWxlIFNUSy00LjMgbGljZW5zZSIgfSx7ICJmaWx0ZXJzLmxpYi92ZXJzaW9uIjogIjAuMyIgfSx7ICJtYXRocy5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXRocy5saWIvbmFtZSI6ICJGYXVzdCBNYXRoIExpYnJhcnkiIH0seyAibWF0aHMubGliL3ZlcnNpb24iOiAiMi41IiB9LHsgIm5hbWUiOiAiZmxhbmdlciIgfSx7ICJvc2NpbGxhdG9ycy5saWIvbmFtZSI6ICJGYXVzdCBPc2NpbGxhdG9yIExpYnJhcnkiIH0seyAib3NjaWxsYXRvcnMubGliL3ZlcnNpb24iOiAiMC4zIiB9LHsgInBoYWZsYW5nZXJzLmxpYi9uYW1lIjogIkZhdXN0IFBoYXNlciBhbmQgRmxhbmdlciBMaWJyYXJ5IiB9LHsgInBoYWZsYW5nZXJzLmxpYi92ZXJzaW9uIjogIjAuMSIgfSx7ICJwbGF0Zm9ybS5saWIvbmFtZSI6ICJHZW5lcmljIFBsYXRmb3JtIExpYnJhcnkiIH0seyAicGxhdGZvcm0ubGliL3ZlcnNpb24iOiAiMC4yIiB9LHsgInJvdXRlcy5saWIvbmFtZSI6ICJGYXVzdCBTaWduYWwgUm91dGluZyBMaWJyYXJ5IiB9LHsgInJvdXRlcy5saWIvdmVyc2lvbiI6ICIwLjIiIH0seyAidmVyc2lvbiI6ICIwLjAiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogInZncm91cCIsImxhYmVsIjogIkZMQU5HRVIiLCJtZXRhIjogW3sgInRvb2x0aXAiOiAiUmVmZXJlbmNlOiBodHRwczovL2Njcm1hLnN0YW5mb3JkLmVkdS9+am9zL3Bhc3AvRmxhbmdpbmcuaHRtbCIgfV0sIml0ZW1zIjogWyB7InR5cGUiOiAiaGdyb3VwIiwibGFiZWwiOiAiMHgwMCIsIm1ldGEiOiBbeyAiMCI6ICIiIH1dLCJpdGVtcyI6IFsgeyJ0eXBlIjogImNoZWNrYm94IiwibGFiZWwiOiAiQnlwYXNzIiwiYWRkcmVzcyI6ICIvRkxBTkdFUi8weDAwL0J5cGFzcyIsImluZGV4IjogMCwibWV0YSI6IFt7ICIwIjogIiIgfSx7ICJ0b29sdGlwIjogIldoZW4gdGhpcyBpcyBjaGVja2VkLCB0aGUgZmxhbmdlciAgICAgICAgIGhhcyBubyBlZmZlY3QiIH1dfSx7InR5cGUiOiAiY2hlY2tib3giLCJsYWJlbCI6ICJJbnZlcnQgRmxhbmdlIFN1bSIsImFkZHJlc3MiOiAiL0ZMQU5HRVIvMHgwMC9JbnZlcnQgRmxhbmdlIFN1bSIsImluZGV4IjogMTY0NjAsIm1ldGEiOiBbeyAiMSI6ICIiIH1dfSx7InR5cGUiOiAiaGJhcmdyYXBoIiwibGFiZWwiOiAiRmxhbmdlIExGTyIsImFkZHJlc3MiOiAiL0ZMQU5HRVIvMHgwMC9GbGFuZ2UgTEZPIiwiaW5kZXgiOiA0OCwibWV0YSI6IFt7ICIyIjogIiIgfSx7ICJzdHlsZSI6ICJsZWQiIH0seyAidG9vbHRpcCI6ICJEaXNwbGF5IHN1bSBvZiBmbGFuZ2UgZGVsYXlzIiB9XSwibWluIjogLTEuNSwibWF4IjogMS41fV19LHsidHlwZSI6ICJoZ3JvdXAiLCJsYWJlbCI6ICIweDAwIiwibWV0YSI6IFt7ICIxIjogIiIgfV0sIml0ZW1zIjogWyB7InR5cGUiOiAiaHNsaWRlciIsImxhYmVsIjogIlNwZWVkIiwiYWRkcmVzcyI6ICIvRkxBTkdFUi8weDAwL1NwZWVkIiwiaW5kZXgiOiAyMCwibWV0YSI6IFt7ICIxIjogIiIgfSx7ICJzdHlsZSI6ICJrbm9iIiB9LHsgInVuaXQiOiAiSHoiIH1dLCJpbml0IjogMC41LCJtaW4iOiAwLCJtYXgiOiAxMCwic3RlcCI6IDAuMDF9LHsidHlwZSI6ICJoc2xpZGVyIiwibGFiZWwiOiAiRGVwdGgiLCJhZGRyZXNzIjogIi9GTEFOR0VSLzB4MDAvRGVwdGgiLCJpbmRleCI6IDE2NDY0LCJtZXRhIjogW3sgIjIiOiAiIiB9LHsgInN0eWxlIjogImtub2IiIH1dLCJpbml0IjogMSwibWluIjogMCwibWF4IjogMSwic3RlcCI6IDAuMDAxfSx7InR5cGUiOiAiaHNsaWRlciIsImxhYmVsIjogIkZlZWRiYWNrIiwiYWRkcmVzcyI6ICIvRkxBTkdFUi8weDAwL0ZlZWRiYWNrIiwiaW5kZXgiOiA1MiwibWV0YSI6IFt7ICIzIjogIiIgfSx7ICJzdHlsZSI6ICJrbm9iIiB9XSwiaW5pdCI6IDAsIm1pbiI6IC0wLjk5OSwibWF4IjogMC45OTksInN0ZXAiOiAwLjAwMX1dfSx7InR5cGUiOiAiaGdyb3VwIiwibGFiZWwiOiAiRGVsYXkgQ29udHJvbHMiLCJtZXRhIjogW3sgIjIiOiAiIiB9XSwiaXRlbXMiOiBbIHsidHlwZSI6ICJoc2xpZGVyIiwibGFiZWwiOiAiRmxhbmdlIERlbGF5IiwiYWRkcmVzcyI6ICIvRkxBTkdFUi9EZWxheSBDb250cm9scy9GbGFuZ2UgRGVsYXkiLCJpbmRleCI6IDE2NDQ4LCJtZXRhIjogW3sgIjEiOiAiIiB9LHsgInN0eWxlIjogImtub2IiIH0seyAidW5pdCI6ICJtcyIgfV0sImluaXQiOiAxMCwibWluIjogMCwibWF4IjogMjAsInN0ZXAiOiAwLjAwMX0seyJ0eXBlIjogImhzbGlkZXIiLCJsYWJlbCI6ICJEZWxheSBPZmZzZXQiLCJhZGRyZXNzIjogIi9GTEFOR0VSL0RlbGF5IENvbnRyb2xzL0RlbGF5IE9mZnNldCIsImluZGV4IjogMTY0NDQsIm1ldGEiOiBbeyAiMiI6ICIiIH0seyAic3R5bGUiOiAia25vYiIgfSx7ICJ1bml0IjogIm1zIiB9XSwiaW5pdCI6IDEsIm1pbiI6IDAsIm1heCI6IDIwLCJzdGVwIjogMC4wMDF9XX0seyJ0eXBlIjogImhncm91cCIsImxhYmVsIjogIjB4MDAiLCJtZXRhIjogW3sgIjMiOiAiIiB9XSwiaXRlbXMiOiBbIHsidHlwZSI6ICJoc2xpZGVyIiwibGFiZWwiOiAiRmxhbmdlciBPdXRwdXQgTGV2ZWwiLCJhZGRyZXNzIjogIi9GTEFOR0VSLzB4MDAvRmxhbmdlciBPdXRwdXQgTGV2ZWwiLCJpbmRleCI6IDQsIm1ldGEiOiBbeyAidW5pdCI6ICJkQiIgfV0sImluaXQiOiAwLCJtaW4iOiAtNjAsIm1heCI6IDEwLCJzdGVwIjogMC4xfV19XX1dfQ=="; }

/*
 faust2wasm: GRAME 2017-2019
*/

'use strict';

// Monophonic Faust DSP
class flangerProcessor extends AudioWorkletProcessor {

    // JSON parsing functions
    static parse_ui(ui, obj, callback) {
        for (var i = 0; i < ui.length; i++) {
            flangerProcessor.parse_group(ui[i], obj, callback);
        }
    }

    static parse_group(group, obj, callback) {
        if (group.items) {
            flangerProcessor.parse_items(group.items, obj, callback);
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
            flangerProcessor.parse_items(item.items, obj, callback);
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
            flangerProcessor.parse_items(item.items, obj, callback);
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
        flangerProcessor.parse_ui(JSON.parse(getJSONflanger()).ui, params, flangerProcessor.parse_item1);
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

        this.flanger_instance = new WebAssembly.Instance(options.processorOptions.wasm_module, importObject);
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

        this.factory = this.flanger_instance.exports;
        this.HEAP = this.flanger_instance.exports.memory.buffer;
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
            flangerProcessor.parse_ui(this.json_object.ui, this, flangerProcessor.parse_item2);

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
    registerProcessor('flanger', flangerProcessor);
} catch (error) {
    console.warn(error);
}
