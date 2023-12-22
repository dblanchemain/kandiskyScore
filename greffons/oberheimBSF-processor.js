
/*
Code generated with Faust version 2.38.8
Compilation options: -lang wasm-ib -es 1 -single -ftz 2
*/

function getJSONoberheimBSF() {
	return '{"name": "oberheimBSF","filename": "oberheimBSF.dsp","version": "2.38.8","compile_options": "-lang wasm-ib -es 1 -single -ftz 2","library_list": ["/usr/local/share/faust/stdfaust.lib","/usr/local/share/faust/signals.lib","/usr/local/share/faust/maths.lib","/usr/local/share/faust/platform.lib","/usr/local/share/faust/vaeffects.lib","/usr/local/share/faust/misceffects.lib"],"include_pathnames": ["/usr/local/share/faust","/usr/local/share/faust","/usr/share/faust",".","/home/dominique/public_html/notateur/faust/oberheimBSF"],"size": 64,"inputs": 2,"outputs": 2,"meta": [ { "author": "Eric Tarr" },{ "compile_options": "-lang wasm-ib -es 1 -single -ftz 2" },{ "description": "Band-Pass Oberheim filter." },{ "filename": "oberheimBSF.dsp" },{ "maths.lib/author": "GRAME" },{ "maths.lib/copyright": "GRAME" },{ "maths.lib/license": "LGPL with exception" },{ "maths.lib/name": "Faust Math Library" },{ "maths.lib/version": "2.5" },{ "misceffects.lib/name": "Misc Effects Library" },{ "misceffects.lib/version": "2.0" },{ "name": "oberheimBSF" },{ "platform.lib/name": "Generic Platform Library" },{ "platform.lib/version": "0.2" },{ "signals.lib/name": "Faust Signal Routing Library" },{ "signals.lib/version": "0.1" },{ "vaeffects.lib/name": "Faust Virtual Analog Filter Effect Library" },{ "vaeffects.lib/oberheim:author": "Eric Tarr" },{ "vaeffects.lib/oberheim:license": "MIT-style STK-4.3 license" },{ "vaeffects.lib/oberheimBSF:author": "Eric Tarr" },{ "vaeffects.lib/oberheimBSF:license": "MIT-style STK-4.3 license" },{ "vaeffects.lib/version": "0.2" },{ "version": "0.0" }],"ui": [ {"type": "hgroup","label": "oberheimBSF","items": [ {"type": "vslider","label": "Q","address": "/oberheimBSF/Q","index": 28,"init": 1,"min": 0.5,"max": 10,"step": 0.01},{"type": "vslider","label": "freq","address": "/oberheimBSF/freq","index": 12,"init": 0.5,"min": 0,"max": 1,"step": 0.001}]}]}';
}
function getBase64CodeoberheimBSF() { return "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AAUgAQsPC4yAgIAAACAAIAFqIAI4AgALC+SOgIAAAQBBAAvdDnsibmFtZSI6ICJvYmVyaGVpbUJTRiIsImZpbGVuYW1lIjogIm9iZXJoZWltQlNGLmRzcCIsInZlcnNpb24iOiAiMi4zOC44IiwiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taWIgLWVzIDEgLXNpbmdsZSAtZnR6IDIiLCJsaWJyYXJ5X2xpc3QiOiBbIi91c3IvbG9jYWwvc2hhcmUvZmF1c3Qvc3RkZmF1c3QubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9zaWduYWxzLmxpYiIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QvbWF0aHMubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9wbGF0Zm9ybS5saWIiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0L3ZhZWZmZWN0cy5saWIiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0L21pc2NlZmZlY3RzLmxpYiJdLCJpbmNsdWRlX3BhdGhuYW1lcyI6IFsiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QiLCIvdXNyL3NoYXJlL2ZhdXN0IiwiLiIsIi9ob21lL2RvbWluaXF1ZS9wdWJsaWNfaHRtbC9ub3RhdGV1ci9mYXVzdC9vYmVyaGVpbUJTRiJdLCJzaXplIjogNjQsImlucHV0cyI6IDIsIm91dHB1dHMiOiAyLCJtZXRhIjogWyB7ICJhdXRob3IiOiAiRXJpYyBUYXJyIiB9LHsgImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWliIC1lcyAxIC1zaW5nbGUgLWZ0eiAyIiB9LHsgImRlc2NyaXB0aW9uIjogIkJhbmQtUGFzcyBPYmVyaGVpbSBmaWx0ZXIuIiB9LHsgImZpbGVuYW1lIjogIm9iZXJoZWltQlNGLmRzcCIgfSx7ICJtYXRocy5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXRocy5saWIvbmFtZSI6ICJGYXVzdCBNYXRoIExpYnJhcnkiIH0seyAibWF0aHMubGliL3ZlcnNpb24iOiAiMi41IiB9LHsgIm1pc2NlZmZlY3RzLmxpYi9uYW1lIjogIk1pc2MgRWZmZWN0cyBMaWJyYXJ5IiB9LHsgIm1pc2NlZmZlY3RzLmxpYi92ZXJzaW9uIjogIjIuMCIgfSx7ICJuYW1lIjogIm9iZXJoZWltQlNGIiB9LHsgInBsYXRmb3JtLmxpYi9uYW1lIjogIkdlbmVyaWMgUGxhdGZvcm0gTGlicmFyeSIgfSx7ICJwbGF0Zm9ybS5saWIvdmVyc2lvbiI6ICIwLjIiIH0seyAic2lnbmFscy5saWIvbmFtZSI6ICJGYXVzdCBTaWduYWwgUm91dGluZyBMaWJyYXJ5IiB9LHsgInNpZ25hbHMubGliL3ZlcnNpb24iOiAiMC4xIiB9LHsgInZhZWZmZWN0cy5saWIvbmFtZSI6ICJGYXVzdCBWaXJ0dWFsIEFuYWxvZyBGaWx0ZXIgRWZmZWN0IExpYnJhcnkiIH0seyAidmFlZmZlY3RzLmxpYi9vYmVyaGVpbTphdXRob3IiOiAiRXJpYyBUYXJyIiB9LHsgInZhZWZmZWN0cy5saWIvb2JlcmhlaW06bGljZW5zZSI6ICJNSVQtc3R5bGUgU1RLLTQuMyBsaWNlbnNlIiB9LHsgInZhZWZmZWN0cy5saWIvb2JlcmhlaW1CU0Y6YXV0aG9yIjogIkVyaWMgVGFyciIgfSx7ICJ2YWVmZmVjdHMubGliL29iZXJoZWltQlNGOmxpY2Vuc2UiOiAiTUlULXN0eWxlIFNUSy00LjMgbGljZW5zZSIgfSx7ICJ2YWVmZmVjdHMubGliL3ZlcnNpb24iOiAiMC4yIiB9LHsgInZlcnNpb24iOiAiMC4wIiB9XSwidWkiOiBbIHsidHlwZSI6ICJoZ3JvdXAiLCJsYWJlbCI6ICJvYmVyaGVpbUJTRiIsIml0ZW1zIjogWyB7InR5cGUiOiAidnNsaWRlciIsImxhYmVsIjogIlEiLCJhZGRyZXNzIjogIi9vYmVyaGVpbUJTRi9RIiwiaW5kZXgiOiAyOCwiaW5pdCI6IDEsIm1pbiI6IDAuNSwibWF4IjogMTAsInN0ZXAiOiAwLjAxfSx7InR5cGUiOiAidnNsaWRlciIsImxhYmVsIjogImZyZXEiLCJhZGRyZXNzIjogIi9vYmVyaGVpbUJTRi9mcmVxIiwiaW5kZXgiOiAxMiwiaW5pdCI6IDAuNSwibWluIjogMCwibWF4IjogMSwic3RlcCI6IDAuMDAxfV19XX0="; }

/*
 faust2wasm: GRAME 2017-2019
*/

'use strict';

// Monophonic Faust DSP
class oberheimBSFProcessor extends AudioWorkletProcessor {

    // JSON parsing functions
    static parse_ui(ui, obj, callback) {
        for (var i = 0; i < ui.length; i++) {
            oberheimBSFProcessor.parse_group(ui[i], obj, callback);
        }
    }

    static parse_group(group, obj, callback) {
        if (group.items) {
            oberheimBSFProcessor.parse_items(group.items, obj, callback);
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
            oberheimBSFProcessor.parse_items(item.items, obj, callback);
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
            oberheimBSFProcessor.parse_items(item.items, obj, callback);
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
        oberheimBSFProcessor.parse_ui(JSON.parse(getJSONoberheimBSF()).ui, params, oberheimBSFProcessor.parse_item1);
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

        this.oberheimBSF_instance = new WebAssembly.Instance(options.processorOptions.wasm_module, importObject);
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

        this.factory = this.oberheimBSF_instance.exports;
        this.HEAP = this.oberheimBSF_instance.exports.memory.buffer;
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
            oberheimBSFProcessor.parse_ui(this.json_object.ui, this, oberheimBSFProcessor.parse_item2);

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
    registerProcessor('oberheimBSF', oberheimBSFProcessor);
} catch (error) {
    console.warn(error);
}
