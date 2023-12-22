
/*
Code generated with Faust version 2.38.8
Compilation options: -lang wasm-ib -es 1 -single -ftz 2
*/

function getJSONchorus() {
	return '{"name": "chorus","filename": "chorus.dsp","version": "2.38.8","compile_options": "-lang wasm-ib -es 1 -single -ftz 2","library_list": ["/usr/local/share/faust/stdfaust.lib","/usr/local/share/faust/maths.lib","/usr/local/share/faust/signals.lib","/usr/local/share/faust/platform.lib","/usr/local/share/faust/basics.lib","/usr/local/share/faust/delays.lib"],"include_pathnames": ["/usr/local/share/faust","/usr/local/share/faust","/usr/share/faust",".","/home/dominique/public_html/notateur/faust/chorus"],"size": 1310776,"inputs": 2,"outputs": 2,"meta": [ { "basics.lib/name": "Faust Basic Element Library" },{ "basics.lib/version": "0.3" },{ "compile_options": "-lang wasm-ib -es 1 -single -ftz 2" },{ "delays.lib/name": "Faust Delay Library" },{ "delays.lib/version": "0.1" },{ "filename": "chorus.dsp" },{ "maths.lib/author": "GRAME" },{ "maths.lib/copyright": "GRAME" },{ "maths.lib/license": "LGPL with exception" },{ "maths.lib/name": "Faust Math Library" },{ "maths.lib/version": "2.5" },{ "name": "chorus" },{ "platform.lib/name": "Generic Platform Library" },{ "platform.lib/version": "0.2" },{ "signals.lib/name": "Faust Signal Routing Library" },{ "signals.lib/version": "0.1" }],"ui": [ {"type": "hgroup","label": "Chorus","items": [ {"type": "vslider","label": "delay","address": "/Chorus/delay","index": 786448,"meta": [{ "name": "Delay" }],"init": 0.02,"min": 0,"max": 0.2,"step": 0.01},{"type": "vslider","label": "depth","address": "/Chorus/depth","index": 786460,"meta": [{ "name": "Depth" }],"init": 0.02,"min": 0,"max": 1,"step": 0.01},{"type": "vslider","label": "freq","address": "/Chorus/freq","index": 786468,"meta": [{ "name": "Freq" }],"init": 3,"min": 0,"max": 10,"step": 0.01},{"type": "vslider","label": "level","address": "/Chorus/level","index": 786436,"meta": [{ "name": "Level" }],"init": 0.5,"min": 0,"max": 1,"step": 0.01}]}]}';
}
function getBase64Codechorus() { return "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RWxlbWVudCBMaWJyYXJ5IiB9LHsgImJhc2ljcy5saWIvdmVyc2lvbiI6ICIwLjMiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taWIgLWVzIDEgLXNpbmdsZSAtZnR6IDIiIH0seyAiZGVsYXlzLmxpYi9uYW1lIjogIkZhdXN0IERlbGF5IExpYnJhcnkiIH0seyAiZGVsYXlzLmxpYi92ZXJzaW9uIjogIjAuMSIgfSx7ICJmaWxlbmFtZSI6ICJjaG9ydXMuZHNwIiB9LHsgIm1hdGhzLmxpYi9hdXRob3IiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2NvcHlyaWdodCI6ICJHUkFNRSIgfSx7ICJtYXRocy5saWIvbGljZW5zZSI6ICJMR1BMIHdpdGggZXhjZXB0aW9uIiB9LHsgIm1hdGhzLmxpYi9uYW1lIjogIkZhdXN0IE1hdGggTGlicmFyeSIgfSx7ICJtYXRocy5saWIvdmVyc2lvbiI6ICIyLjUiIH0seyAibmFtZSI6ICJjaG9ydXMiIH0seyAicGxhdGZvcm0ubGliL25hbWUiOiAiR2VuZXJpYyBQbGF0Zm9ybSBMaWJyYXJ5IiB9LHsgInBsYXRmb3JtLmxpYi92ZXJzaW9uIjogIjAuMiIgfSx7ICJzaWduYWxzLmxpYi9uYW1lIjogIkZhdXN0IFNpZ25hbCBSb3V0aW5nIExpYnJhcnkiIH0seyAic2lnbmFscy5saWIvdmVyc2lvbiI6ICIwLjEiIH1dLCJ1aSI6IFsgeyJ0eXBlIjogImhncm91cCIsImxhYmVsIjogIkNob3J1cyIsIml0ZW1zIjogWyB7InR5cGUiOiAidnNsaWRlciIsImxhYmVsIjogImRlbGF5IiwiYWRkcmVzcyI6ICIvQ2hvcnVzL2RlbGF5IiwiaW5kZXgiOiA3ODY0NDgsIm1ldGEiOiBbeyAibmFtZSI6ICJEZWxheSIgfV0sImluaXQiOiAwLjAyLCJtaW4iOiAwLCJtYXgiOiAwLjIsInN0ZXAiOiAwLjAxfSx7InR5cGUiOiAidnNsaWRlciIsImxhYmVsIjogImRlcHRoIiwiYWRkcmVzcyI6ICIvQ2hvcnVzL2RlcHRoIiwiaW5kZXgiOiA3ODY0NjAsIm1ldGEiOiBbeyAibmFtZSI6ICJEZXB0aCIgfV0sImluaXQiOiAwLjAyLCJtaW4iOiAwLCJtYXgiOiAxLCJzdGVwIjogMC4wMX0seyJ0eXBlIjogInZzbGlkZXIiLCJsYWJlbCI6ICJmcmVxIiwiYWRkcmVzcyI6ICIvQ2hvcnVzL2ZyZXEiLCJpbmRleCI6IDc4NjQ2OCwibWV0YSI6IFt7ICJuYW1lIjogIkZyZXEiIH1dLCJpbml0IjogMywibWluIjogMCwibWF4IjogMTAsInN0ZXAiOiAwLjAxfSx7InR5cGUiOiAidnNsaWRlciIsImxhYmVsIjogImxldmVsIiwiYWRkcmVzcyI6ICIvQ2hvcnVzL2xldmVsIiwiaW5kZXgiOiA3ODY0MzYsIm1ldGEiOiBbeyAibmFtZSI6ICJMZXZlbCIgfV0sImluaXQiOiAwLjUsIm1pbiI6IDAsIm1heCI6IDEsInN0ZXAiOiAwLjAxfV19XX0="; }

/*
 faust2wasm: GRAME 2017-2019
*/

'use strict';

// Monophonic Faust DSP
class chorusProcessor extends AudioWorkletProcessor {

    // JSON parsing functions
    static parse_ui(ui, obj, callback) {
        for (var i = 0; i < ui.length; i++) {
            chorusProcessor.parse_group(ui[i], obj, callback);
        }
    }

    static parse_group(group, obj, callback) {
        if (group.items) {
            chorusProcessor.parse_items(group.items, obj, callback);
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
            chorusProcessor.parse_items(item.items, obj, callback);
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
            chorusProcessor.parse_items(item.items, obj, callback);
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
        chorusProcessor.parse_ui(JSON.parse(getJSONchorus()).ui, params, chorusProcessor.parse_item1);
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

        this.chorus_instance = new WebAssembly.Instance(options.processorOptions.wasm_module, importObject);
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

        this.factory = this.chorus_instance.exports;
        this.HEAP = this.chorus_instance.exports.memory.buffer;
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
            chorusProcessor.parse_ui(this.json_object.ui, this, chorusProcessor.parse_item2);

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
    registerProcessor('chorus', chorusProcessor);
} catch (error) {
    console.warn(error);
}
