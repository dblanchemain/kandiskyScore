
/*
Code generated with Faust version 2.38.8
Compilation options: -lang wasm-ib -es 1 -single -ftz 2
*/

function getJSONmodulation() {
	return '{"name": "modulation","filename": "modulation.dsp","version": "2.38.8","compile_options": "-lang wasm-ib -es 1 -single -ftz 2","library_list": ["/usr/local/share/faust/stdfaust.lib","/usr/local/share/faust/signals.lib","/usr/local/share/faust/envelopes.lib","/usr/local/share/faust/maths.lib","/usr/local/share/faust/platform.lib","/usr/local/share/faust/instruments.lib","/usr/local/share/faust/oscillators.lib","/usr/local/share/faust/basics.lib","/usr/local/share/faust/filters.lib"],"include_pathnames": ["/usr/local/share/faust","/usr/local/share/faust","/usr/share/faust",".","/home/dominique/public_html/notateur/faust/modulation"],"size": 262436,"inputs": 2,"outputs": 2,"meta": [ { "basics.lib/name": "Faust Basic Element Library" },{ "basics.lib/version": "0.3" },{ "compile_options": "-lang wasm-ib -es 1 -single -ftz 2" },{ "envelopes.lib/asr:author": "Yann Orlarey, Stéphane Letz" },{ "envelopes.lib/author": "GRAME" },{ "envelopes.lib/copyright": "GRAME" },{ "envelopes.lib/license": "LGPL with exception" },{ "envelopes.lib/name": "Faust Envelope Library" },{ "envelopes.lib/version": "0.1" },{ "filename": "modulation.dsp" },{ "filters.lib/allpassnn:author": "Julius O. Smith III" },{ "filters.lib/allpassnn:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/allpassnn:license": "MIT-style STK-4.3 license" },{ "filters.lib/lowpass0_highpass1": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/name": "Faust Filters Library" },{ "filters.lib/version": "0.3" },{ "instruments.lib/author": "Romain Michon (rmichon@ccrma.stanford.edu)" },{ "instruments.lib/copyright": "Romain Michon" },{ "instruments.lib/licence": "STK-4.3" },{ "instruments.lib/name": "Faust-STK Tools Library" },{ "instruments.lib/version": "1.0" },{ "maths.lib/author": "GRAME" },{ "maths.lib/copyright": "GRAME" },{ "maths.lib/license": "LGPL with exception" },{ "maths.lib/name": "Faust Math Library" },{ "maths.lib/version": "2.5" },{ "name": "modulation" },{ "oscillators.lib/name": "Faust Oscillator Library" },{ "oscillators.lib/version": "0.3" },{ "platform.lib/name": "Generic Platform Library" },{ "platform.lib/version": "0.2" },{ "signals.lib/name": "Faust Signal Routing Library" },{ "signals.lib/version": "0.1" }],"ui": [ {"type": "vgroup","label": "Modulation","items": [ {"type": "hslider","label": "ON/OFF (ASR Envelope)","address": "/Modulation/ON/OFF (ASR Envelope)","index": 262192,"meta": [{ "1": "" },{ "acc": "2 0 -10 0 10" }],"init": 1,"min": 0,"max": 1,"step": 1},{"type": "hslider","label": "Modulation Type","address": "/Modulation/Modulation Type","index": 262144,"meta": [{ "2": "" },{ "style": "radio{\'0\':0;\'1\':1;\'2\':2;\'3\':3;\'4\':4}" }],"init": 0,"min": 0,"max": 4,"step": 1},{"type": "hslider","label": "Modulating Frequency","address": "/Modulation/Modulating Frequency","index": 262168,"meta": [{ "3": "" },{ "acc": "1 1 -10 0 10" },{ "style": "knob" },{ "unit": "Hz" }],"init": 204.8,"min": 50,"max": 1700,"step": 0.1},{"type": "hslider","label": "Modulation Intensity","address": "/Modulation/Modulation Intensity","index": 262156,"meta": [{ "4": "" },{ "acc": "1 0 -10 0 10" },{ "style": "knob" }],"init": 0.1,"min": 0,"max": 1,"step": 0.001}]}]}';
}
function getBase64Codemodulation() { return "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HgNAAkBBhIIQIB5BAnRqQwAAAAA4AgAgHkEBaiEeIB5BAkgEQAwCDAELCwtBACEfA0ACQEGMghAgH0ECdGpDAAAAADgCACAfQQFqIR8gH0ECSARADAIMAQsLCwvdgICAAAEBfUMAgDtIQwAAgD9BACgCkIAQspeWIQJBACABNgKQgBBDAIA7SEMAAIA/QQAoApCAELKXliECQQBDAACAPyAClTgClIAQQQBDAACAP0MAAIA/IAKXlTgCrIAQC5CAgIAAACAAIAEQCyAAEA0gABAKC7KAgIAAAEEAQwAAAAA4AoCAEEEAQ83MzD04AoyAEEEAQ83MTEM4ApiAEEEAQwAAgD84ArCAEAuQgICAAAAgACABSAR/IAEFIAALDwuQgICAAAAgACABSAR/IAAFIAELDwuMgICAAAAgACABaiACOAIACwvDmYCAAAEAQQALvBl7Im5hbWUiOiAibW9kdWxhdGlvbiIsImZpbGVuYW1lIjogIm1vZHVsYXRpb24uZHNwIiwidmVyc2lvbiI6ICIyLjM4LjgiLCJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pYiAtZXMgMSAtc2luZ2xlIC1mdHogMiIsImxpYnJhcnlfbGlzdCI6IFsiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9zdGRmYXVzdC5saWIiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0L3NpZ25hbHMubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9lbnZlbG9wZXMubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9tYXRocy5saWIiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0L3BsYXRmb3JtLmxpYiIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QvaW5zdHJ1bWVudHMubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9vc2NpbGxhdG9ycy5saWIiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0L2Jhc2ljcy5saWIiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0L2ZpbHRlcnMubGliIl0sImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIiwiL2hvbWUvZG9taW5pcXVlL3B1YmxpY19odG1sL25vdGF0ZXVyL2ZhdXN0L21vZHVsYXRpb24iXSwic2l6ZSI6IDI2MjQzNiwiaW5wdXRzIjogMiwib3V0cHV0cyI6IDIsIm1ldGEiOiBbIHsgImJhc2ljcy5saWIvbmFtZSI6ICJGYXVzdCBCYXNpYyBFbGVtZW50IExpYnJhcnkiIH0seyAiYmFzaWNzLmxpYi92ZXJzaW9uIjogIjAuMyIgfSx7ICJjb21waWxlX29wdGlvbnMiOiAiLWxhbmcgd2FzbS1pYiAtZXMgMSAtc2luZ2xlIC1mdHogMiIgfSx7ICJlbnZlbG9wZXMubGliL2FzcjphdXRob3IiOiAiWWFubiBPcmxhcmV5LCBTdMOpcGhhbmUgTGV0eiIgfSx7ICJlbnZlbG9wZXMubGliL2F1dGhvciI6ICJHUkFNRSIgfSx7ICJlbnZlbG9wZXMubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJlbnZlbG9wZXMubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJlbnZlbG9wZXMubGliL25hbWUiOiAiRmF1c3QgRW52ZWxvcGUgTGlicmFyeSIgfSx7ICJlbnZlbG9wZXMubGliL3ZlcnNpb24iOiAiMC4xIiB9LHsgImZpbGVuYW1lIjogIm1vZHVsYXRpb24uZHNwIiB9LHsgImZpbHRlcnMubGliL2FsbHBhc3NubjphdXRob3IiOiAiSnVsaXVzIE8uIFNtaXRoIElJSSIgfSx7ICJmaWx0ZXJzLmxpYi9hbGxwYXNzbm46Y29weXJpZ2h0IjogIkNvcHlyaWdodCAoQykgMjAwMy0yMDE5IGJ5IEp1bGl1cyBPLiBTbWl0aCBJSUkgPGpvc0BjY3JtYS5zdGFuZm9yZC5lZHU+IiB9LHsgImZpbHRlcnMubGliL2FsbHBhc3NubjpsaWNlbnNlIjogIk1JVC1zdHlsZSBTVEstNC4zIGxpY2Vuc2UiIH0seyAiZmlsdGVycy5saWIvbG93cGFzczBfaGlnaHBhc3MxIjogIkNvcHlyaWdodCAoQykgMjAwMy0yMDE5IGJ5IEp1bGl1cyBPLiBTbWl0aCBJSUkgPGpvc0BjY3JtYS5zdGFuZm9yZC5lZHU+IiB9LHsgImZpbHRlcnMubGliL25hbWUiOiAiRmF1c3QgRmlsdGVycyBMaWJyYXJ5IiB9LHsgImZpbHRlcnMubGliL3ZlcnNpb24iOiAiMC4zIiB9LHsgImluc3RydW1lbnRzLmxpYi9hdXRob3IiOiAiUm9tYWluIE1pY2hvbiAocm1pY2hvbkBjY3JtYS5zdGFuZm9yZC5lZHUpIiB9LHsgImluc3RydW1lbnRzLmxpYi9jb3B5cmlnaHQiOiAiUm9tYWluIE1pY2hvbiIgfSx7ICJpbnN0cnVtZW50cy5saWIvbGljZW5jZSI6ICJTVEstNC4zIiB9LHsgImluc3RydW1lbnRzLmxpYi9uYW1lIjogIkZhdXN0LVNUSyBUb29scyBMaWJyYXJ5IiB9LHsgImluc3RydW1lbnRzLmxpYi92ZXJzaW9uIjogIjEuMCIgfSx7ICJtYXRocy5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXRocy5saWIvbmFtZSI6ICJGYXVzdCBNYXRoIExpYnJhcnkiIH0seyAibWF0aHMubGliL3ZlcnNpb24iOiAiMi41IiB9LHsgIm5hbWUiOiAibW9kdWxhdGlvbiIgfSx7ICJvc2NpbGxhdG9ycy5saWIvbmFtZSI6ICJGYXVzdCBPc2NpbGxhdG9yIExpYnJhcnkiIH0seyAib3NjaWxsYXRvcnMubGliL3ZlcnNpb24iOiAiMC4zIiB9LHsgInBsYXRmb3JtLmxpYi9uYW1lIjogIkdlbmVyaWMgUGxhdGZvcm0gTGlicmFyeSIgfSx7ICJwbGF0Zm9ybS5saWIvdmVyc2lvbiI6ICIwLjIiIH0seyAic2lnbmFscy5saWIvbmFtZSI6ICJGYXVzdCBTaWduYWwgUm91dGluZyBMaWJyYXJ5IiB9LHsgInNpZ25hbHMubGliL3ZlcnNpb24iOiAiMC4xIiB9XSwidWkiOiBbIHsidHlwZSI6ICJ2Z3JvdXAiLCJsYWJlbCI6ICJNb2R1bGF0aW9uIiwiaXRlbXMiOiBbIHsidHlwZSI6ICJoc2xpZGVyIiwibGFiZWwiOiAiT04vT0ZGIChBU1IgRW52ZWxvcGUpIiwiYWRkcmVzcyI6ICIvTW9kdWxhdGlvbi9PTi9PRkYgKEFTUiBFbnZlbG9wZSkiLCJpbmRleCI6IDI2MjE5MiwibWV0YSI6IFt7ICIxIjogIiIgfSx7ICJhY2MiOiAiMiAwIC0xMCAwIDEwIiB9XSwiaW5pdCI6IDEsIm1pbiI6IDAsIm1heCI6IDEsInN0ZXAiOiAxfSx7InR5cGUiOiAiaHNsaWRlciIsImxhYmVsIjogIk1vZHVsYXRpb24gVHlwZSIsImFkZHJlc3MiOiAiL01vZHVsYXRpb24vTW9kdWxhdGlvbiBUeXBlIiwiaW5kZXgiOiAyNjIxNDQsIm1ldGEiOiBbeyAiMiI6ICIiIH0seyAic3R5bGUiOiAicmFkaW97JzAnOjA7JzEnOjE7JzInOjI7JzMnOjM7JzQnOjR9IiB9XSwiaW5pdCI6IDAsIm1pbiI6IDAsIm1heCI6IDQsInN0ZXAiOiAxfSx7InR5cGUiOiAiaHNsaWRlciIsImxhYmVsIjogIk1vZHVsYXRpbmcgRnJlcXVlbmN5IiwiYWRkcmVzcyI6ICIvTW9kdWxhdGlvbi9Nb2R1bGF0aW5nIEZyZXF1ZW5jeSIsImluZGV4IjogMjYyMTY4LCJtZXRhIjogW3sgIjMiOiAiIiB9LHsgImFjYyI6ICIxIDEgLTEwIDAgMTAiIH0seyAic3R5bGUiOiAia25vYiIgfSx7ICJ1bml0IjogIkh6IiB9XSwiaW5pdCI6IDIwNC44LCJtaW4iOiA1MCwibWF4IjogMTcwMCwic3RlcCI6IDAuMX0seyJ0eXBlIjogImhzbGlkZXIiLCJsYWJlbCI6ICJNb2R1bGF0aW9uIEludGVuc2l0eSIsImFkZHJlc3MiOiAiL01vZHVsYXRpb24vTW9kdWxhdGlvbiBJbnRlbnNpdHkiLCJpbmRleCI6IDI2MjE1NiwibWV0YSI6IFt7ICI0IjogIiIgfSx7ICJhY2MiOiAiMSAwIC0xMCAwIDEwIiB9LHsgInN0eWxlIjogImtub2IiIH1dLCJpbml0IjogMC4xLCJtaW4iOiAwLCJtYXgiOiAxLCJzdGVwIjogMC4wMDF9XX1dfQ=="; }

/*
 faust2wasm: GRAME 2017-2019
*/

'use strict';

// Monophonic Faust DSP
class modulationProcessor extends AudioWorkletProcessor {

    // JSON parsing functions
    static parse_ui(ui, obj, callback) {
        for (var i = 0; i < ui.length; i++) {
            modulationProcessor.parse_group(ui[i], obj, callback);
        }
    }

    static parse_group(group, obj, callback) {
        if (group.items) {
            modulationProcessor.parse_items(group.items, obj, callback);
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
            modulationProcessor.parse_items(item.items, obj, callback);
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
            modulationProcessor.parse_items(item.items, obj, callback);
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
        modulationProcessor.parse_ui(JSON.parse(getJSONmodulation()).ui, params, modulationProcessor.parse_item1);
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

        this.modulation_instance = new WebAssembly.Instance(options.processorOptions.wasm_module, importObject);
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

        this.factory = this.modulation_instance.exports;
        this.HEAP = this.modulation_instance.exports.memory.buffer;
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
            modulationProcessor.parse_ui(this.json_object.ui, this, modulationProcessor.parse_item2);

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
    registerProcessor('modulation', modulationProcessor);
} catch (error) {
    console.warn(error);
}
