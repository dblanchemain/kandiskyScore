
/*
Code generated with Faust version 2.38.8
Compilation options: -lang wasm-ib -es 1 -single -ftz 2
*/

function getJSONphaser() {
	return '{"name": "phaser","filename": "phaser.dsp","version": "2.38.8","compile_options": "-lang wasm-ib -es 1 -single -ftz 2","library_list": ["/usr/local/share/faust/stdfaust.lib","/usr/local/share/faust/demos.lib","/usr/local/share/faust/basics.lib","/usr/local/share/faust/phaflangers.lib","/usr/local/share/faust/oscillators.lib","/usr/local/share/faust/filters.lib","/usr/local/share/faust/maths.lib","/usr/local/share/faust/platform.lib","/usr/local/share/faust/routes.lib"],"include_pathnames": ["/usr/local/share/faust","/usr/local/share/faust","/usr/share/faust",".","/home/dominique/public_html/notateur/faust/phaser"],"size": 192,"inputs": 2,"outputs": 2,"meta": [ { "author": "JOS, revised by RM" },{ "basics.lib/name": "Faust Basic Element Library" },{ "basics.lib/version": "0.3" },{ "compile_options": "-lang wasm-ib -es 1 -single -ftz 2" },{ "demos.lib/name": "Faust Demos Library" },{ "demos.lib/version": "0.1" },{ "description": "Phaser demo application." },{ "filename": "phaser.dsp" },{ "filters.lib/fir:author": "Julius O. Smith III" },{ "filters.lib/fir:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/fir:license": "MIT-style STK-4.3 license" },{ "filters.lib/iir:author": "Julius O. Smith III" },{ "filters.lib/iir:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/iir:license": "MIT-style STK-4.3 license" },{ "filters.lib/lowpass0_highpass1": "MIT-style STK-4.3 license" },{ "filters.lib/name": "Faust Filters Library" },{ "filters.lib/nlf2:author": "Julius O. Smith III" },{ "filters.lib/nlf2:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/nlf2:license": "MIT-style STK-4.3 license" },{ "filters.lib/tf2:author": "Julius O. Smith III" },{ "filters.lib/tf2:copyright": "Copyright (C) 2003-2019 by Julius O. Smith III <jos@ccrma.stanford.edu>" },{ "filters.lib/tf2:license": "MIT-style STK-4.3 license" },{ "filters.lib/version": "0.3" },{ "maths.lib/author": "GRAME" },{ "maths.lib/copyright": "GRAME" },{ "maths.lib/license": "LGPL with exception" },{ "maths.lib/name": "Faust Math Library" },{ "maths.lib/version": "2.5" },{ "name": "phaser" },{ "oscillators.lib/name": "Faust Oscillator Library" },{ "oscillators.lib/version": "0.3" },{ "phaflangers.lib/name": "Faust Phaser and Flanger Library" },{ "phaflangers.lib/version": "0.1" },{ "platform.lib/name": "Generic Platform Library" },{ "platform.lib/version": "0.2" },{ "routes.lib/name": "Faust Signal Routing Library" },{ "routes.lib/version": "0.2" },{ "version": "0.0" }],"ui": [ {"type": "vgroup","label": "PHASER2","meta": [{ "tooltip": "Reference:         https://ccrma.stanford.edu/~jos/pasp/Flanging.html" }],"items": [ {"type": "hgroup","label": "0x00","meta": [{ "0": "" }],"items": [ {"type": "checkbox","label": "Bypass","address": "/PHASER2/0x00/Bypass","index": 0,"meta": [{ "0": "" },{ "tooltip": "When this is checked, the phaser         has no effect" }]},{"type": "checkbox","label": "Invert Internal Phaser Sum","address": "/PHASER2/0x00/Invert Internal Phaser Sum","index": 132,"meta": [{ "1": "" }]},{"type": "checkbox","label": "Vibrato Mode","address": "/PHASER2/0x00/Vibrato Mode","index": 8,"meta": [{ "2": "" }]}]},{"type": "hgroup","label": "0x00","meta": [{ "1": "" }],"items": [ {"type": "hslider","label": "Speed","address": "/PHASER2/0x00/Speed","index": 56,"meta": [{ "1": "" },{ "style": "knob" },{ "unit": "Hz" }],"init": 0.5,"min": 0,"max": 10,"step": 0.001},{"type": "hslider","label": "Notch Depth (Intensity)","address": "/PHASER2/0x00/Notch Depth (Intensity)","index": 12,"meta": [{ "2": "" },{ "style": "knob" }],"init": 1,"min": 0,"max": 1,"step": 0.001},{"type": "hslider","label": "Feedback Gain","address": "/PHASER2/0x00/Feedback Gain","index": 28,"meta": [{ "3": "" },{ "style": "knob" }],"init": 0,"min": -0.999,"max": 0.999,"step": 0.001}]},{"type": "hgroup","label": "0x00","meta": [{ "2": "" }],"items": [ {"type": "hslider","label": "Notch width","address": "/PHASER2/0x00/Notch width","index": 24,"meta": [{ "1": "" },{ "scale": "log" },{ "style": "knob" },{ "unit": "Hz" }],"init": 1000,"min": 10,"max": 5000,"step": 1},{"type": "hslider","label": "Min Notch1 Freq","address": "/PHASER2/0x00/Min Notch1 Freq","index": 48,"meta": [{ "2": "" },{ "scale": "log" },{ "style": "knob" },{ "unit": "Hz" }],"init": 100,"min": 20,"max": 5000,"step": 1},{"type": "hslider","label": "Max Notch1 Freq","address": "/PHASER2/0x00/Max Notch1 Freq","index": 52,"meta": [{ "3": "" },{ "scale": "log" },{ "style": "knob" },{ "unit": "Hz" }],"init": 800,"min": 20,"max": 10000,"step": 1},{"type": "hslider","label": "Notch Freq Ratio: NotchFreq(n+1)/NotchFreq(n)","address": "/PHASER2/0x00/Notch Freq Ratio: NotchFreq(n+1)/NotchFreq(n)","index": 40,"meta": [{ "4": "" },{ "style": "knob" }],"init": 1.5,"min": 1.1,"max": 4,"step": 0.001}]},{"type": "hgroup","label": "0x00","meta": [{ "3": "" }],"items": [ {"type": "hslider","label": "Phaser Output Level","address": "/PHASER2/0x00/Phaser Output Level","index": 4,"meta": [{ "unit": "dB" }],"init": 0,"min": -60,"max": 10,"step": 0.1}]}]}]}';
}
function getBase64Codephaser() { return "AGFzbQEAAAAB4ICAgAASYAJ/fwBgBH9/f38AYAF9AX1gAX0BfWABfwF/YAF/AX9gAn9/AX1gAX8Bf2ACf38AYAF/AGACf38AYAJ/fwBgAX8AYAJ/fwF/YAJ/fwF/YAJ9fQF9YAN/f30AYAF9AX0CsYCAgAAEA2VudgVfY29zZgACA2VudgVfZXhwZgADA2VudgVfcG93ZgAPA2VudgVfc2luZgARA4+AgIAADgABBAUGBwgJCgsMDQ4QBYyAgIAAAQGEgICAAOyHgIAAB7qBgIAADAdjb21wdXRlAAUMZ2V0TnVtSW5wdXRzAAYNZ2V0TnVtT3V0cHV0cwAHDWdldFBhcmFtVmFsdWUACA1nZXRTYW1wbGVSYXRlAAkEaW5pdAAKDWluc3RhbmNlQ2xlYXIACxFpbnN0YW5jZUNvbnN0YW50cwAMDGluc3RhbmNlSW5pdAANGmluc3RhbmNlUmVzZXRVc2VySW50ZXJmYWNlAA4Nc2V0UGFyYW1WYWx1ZQARBm1lbW9yeQIACuaWgIAADoKAgIAAAAvvjoCAAAIGfzB9QQAhBEEAIQVBACEGQQAhB0EAIQhDAAAAACEKQwAAAAAhC0MAAAAAIQxDAAAAACENQwAAAAAhDkMAAAAAIQ9DAAAAACEQQwAAAAAhEUMAAAAAIRJDAAAAACETQwAAAAAhFEMAAAAAIRVDAAAAACEWQwAAAAAhF0MAAAAAIRhDAAAAACEZQwAAAAAhGkMAAAAAIRtDAAAAACEcQwAAAAAhHUEAIQlDAAAAACEeQwAAAAAhH0MAAAAAISBDAAAAACEhQwAAAAAhIkMAAAAAISNDAAAAACEkQwAAAAAhJUMAAAAAISZDAAAAACEnQwAAAAAhKEMAAAAAISlDAAAAACEqQwAAAAAhK0MAAAAAISxDAAAAACEtQwAAAAAhLkMAAAAAIS9DAAAAACEwQwAAAAAhMUMAAAAAITJDAAAAACEzQwAAAAAhNEMAAAAAITVDAAAAACE2QwAAAAAhN0MAAAAAIThDAAAAACE5IAJBAGooAgAhBCACQQRqKAIAIQUgA0EAaigCACEGIANBBGooAgAhB0EAKgIAqCEIQwAAIEFDzcxMPUEAKgIElBACIQpBACoCDCELQwAAAD9BACoCCKgEfUMAAABABSALC5QhDEMAAIA/IAyTIQ1BACoCFEMAAAAAQ9sPSUBBACoCGJSTlBABIQ4gDkMAAABAEAIhD0MAAAAAQwAAAEAgDpSTIRBBACoCHCERQQAqAighEkEAKgIwIRNBACoCLCATlCEUQwAAAD9DAAAAAEEAKgIsIBMgE0EAKgI0l5OUk5QhFUEAKgIsQQAqAjiUIRYgFhADIRcgFhAAIRggEkMAAABAEAIhGSASQwAAQEAQAiEaIBJDAACAQBACIRtDAACAvyAMlCEcQQAqAoQBqAR9IBwFIAwLIR1BACEJA0ACQCAEIAlqKgIAIR4gCAR9QwAAAAAFIB4LIR9BAEEBNgIgIBdBACoCSJQgGEEAKgJAlJIhIEEAICC8QYCAgPwHcQR9ICAFQwAAAAALOAI8QQFBACgCJGuyIBhBACoCSJSSIBdBACoCQJSTISFBACAhvEGAgID8B3EEfSAhBUMAAAAACzgCRCAUIBVDAACAP0EAKgI8k5SSISJBACoCUCASICKUEACUISMgCiAflCARQQAqAoABlJIgECAjlCAPQQAqAlSUkpMhJEEAICS8QYCAgPwHcQR9ICQFQwAAAAALOAJMQQAqAlwgGSAilBAAlCElIBAgIyAlk5RBACoCVCAPQQAqAkxBACoCYJOUkpIhJkEAICa8QYCAgPwHcQR9ICYFQwAAAAALOAJYQQAqAmggGiAilBAAlCEnIBAgJSAnk5RBACoCYCAPQQAqAlhBACoCbJOUkpIhKEEAICi8QYCAgPwHcQR9ICgFQwAAAAALOAJkQQAqAnQgGyAilBAAlCEpIBAgJyApk5RBACoCbCAPQQAqAmRBACoCeJOUkpIhKkEAICq8QYCAgPwHcQR9ICoFQwAAAAALOAJwIA9BACoCcJQgECAplEEAKgJ4kpIhK0EAICu8QYCAgPwHcQR9ICsFQwAAAAALOAJ8IAogHyANlJRBACoCfCAdlJIhLCAGIAlqIAgEfSAeBSAsCzgCACAFIAlqKgIAIS0gCAR9QwAAAAAFIC0LIS4gFCAVQwAAgD9BACoCRJOUkiEvQQAqAowBIBIgL5QQAJQhMCAKIC6UIBFBACoCvAGUkiAQIDCUIA9BACoCkAGUkpMhMUEAIDG8QYCAgPwHcQR9IDEFQwAAAAALOAKIAUEAKgKYASAZIC+UEACUITIgECAwIDKTlEEAKgKQASAPQQAqAogBQQAqApwBk5SSkiEzQQAgM7xBgICA/AdxBH0gMwVDAAAAAAs4ApQBQQAqAqQBIBogL5QQAJQhNCAQIDIgNJOUQQAqApwBIA9BACoClAFBACoCqAGTlJKSITVBACA1vEGAgID8B3EEfSA1BUMAAAAACzgCoAFBACoCsAEgGyAvlBAAlCE2IBAgNCA2k5RBACoCqAEgD0EAKgKgAUEAKgK0AZOUkpIhN0EAIDe8QYCAgPwHcQR9IDcFQwAAAAALOAKsASAPQQAqAqwBlCAQIDaUQQAqArQBkpIhOEEAIDi8QYCAgPwHcQR9IDgFQwAAAAALOAK4ASAKIC4gDZSUQQAqArgBIB2UkiE5IAcgCWogCAR9IC0FIDkLOAIAQQBBACgCIDYCJEEAQQAqAjw4AkBBAEEAKgJEOAJIQQBBACoCUDgCVEEAQQAqAkw4AlBBAEEAKgJcOAJgQQBBACoCWDgCXEEAQQAqAmg4AmxBAEEAKgJkOAJoQQBBACoCdDgCeEEAQQAqAnA4AnRBAEEAKgJ8OAKAAUEAQQAqAowBOAKQAUEAQQAqAogBOAKMAUEAQQAqApgBOAKcAUEAQQAqApQBOAKYAUEAQQAqAqQBOAKoAUEAQQAqAqABOAKkAUEAQQAqArABOAK0AUEAQQAqAqwBOAKwAUEAQQAqArgBOAK8ASAJQQRqIQkgCUEEIAFsSARADAIMAQsLCwuFgICAAABBAg8LhYCAgAAAQQIPC4uAgIAAACAAIAFqKgIADwuIgICAAABBACgCEA8LjoCAgAAAIAAgARAEIAAgARANC4mFgIAAAQ1/QQAhAUEAIQJBACEDQQAhBEEAIQVBACEGQQAhB0EAIQhBACEJQQAhCkEAIQtBACEMQQAhDUEAIQEDQAJAQSAgAUECdGpBADYCACABQQFqIQEgAUECSARADAIMAQsLC0EAIQIDQAJAQTwgAkECdGpDAAAAADgCACACQQFqIQIgAkECSARADAIMAQsLC0EAIQMDQAJAQcQAIANBAnRqQwAAAAA4AgAgA0EBaiEDIANBAkgEQAwCDAELCwtBACEEA0ACQEHMACAEQQJ0akMAAAAAOAIAIARBAWohBCAEQQNIBEAMAgwBCwsLQQAhBQNAAkBB2AAgBUECdGpDAAAAADgCACAFQQFqIQUgBUEDSARADAIMAQsLC0EAIQYDQAJAQeQAIAZBAnRqQwAAAAA4AgAgBkEBaiEGIAZBA0gEQAwCDAELCwtBACEHA0ACQEHwACAHQQJ0akMAAAAAOAIAIAdBAWohByAHQQNIBEAMAgwBCwsLQQAhCANAAkBB/AAgCEECdGpDAAAAADgCACAIQQFqIQggCEECSARADAIMAQsLC0EAIQkDQAJAQYgBIAlBAnRqQwAAAAA4AgAgCUEBaiEJIAlBA0gEQAwCDAELCwtBACEKA0ACQEGUASAKQQJ0akMAAAAAOAIAIApBAWohCiAKQQNIBEAMAgwBCwsLQQAhCwNAAkBBoAEgC0ECdGpDAAAAADgCACALQQFqIQsgC0EDSARADAIMAQsLC0EAIQwDQAJAQawBIAxBAnRqQwAAAAA4AgAgDEEBaiEMIAxBA0gEQAwCDAELCwtBACENA0ACQEG4ASANQQJ0akMAAAAAOAIAIA1BAWohDSANQQJIBEAMAgwBCwsLC82AgIAAAQF9QwCAO0hDAACAP0EAKAIQspeWIQJBACABNgIQQwCAO0hDAACAP0EAKAIQspeWIQJBAEMAAIA/IAKVOAIUQQBD2w/JQCAClTgCLAuQgICAAAAgACABEAwgABAOIAAQCwvxgICAAABBAEMAAAAAOAIAQQBDAAAAADgCBEEAQwAAAAA4AghBAEMAAIA/OAIMQQBDAAB6RDgCGEEAQwAAAAA4AhxBAEMAAMA/OAIoQQBDAADIQjgCMEEAQwAASEQ4AjRBAEMAAAA/OAI4QQBDAAAAADgChAELkICAgAAAIAAgAUgEfyABBSAACw8LkICAgAAAIAAgAUgEfyAABSABCw8LjICAgAAAIAAgAWogAjgCAAsLtaiAgAABAEEAC64oeyJuYW1lIjogInBoYXNlciIsImZpbGVuYW1lIjogInBoYXNlci5kc3AiLCJ2ZXJzaW9uIjogIjIuMzguOCIsImNvbXBpbGVfb3B0aW9ucyI6ICItbGFuZyB3YXNtLWliIC1lcyAxIC1zaW5nbGUgLWZ0eiAyIiwibGlicmFyeV9saXN0IjogWyIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0L3N0ZGZhdXN0LmxpYiIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QvZGVtb3MubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9iYXNpY3MubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9waGFmbGFuZ2Vycy5saWIiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0L29zY2lsbGF0b3JzLmxpYiIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QvZmlsdGVycy5saWIiLCIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0L21hdGhzLmxpYiIsIi91c3IvbG9jYWwvc2hhcmUvZmF1c3QvcGxhdGZvcm0ubGliIiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdC9yb3V0ZXMubGliIl0sImluY2x1ZGVfcGF0aG5hbWVzIjogWyIvdXNyL2xvY2FsL3NoYXJlL2ZhdXN0IiwiL3Vzci9sb2NhbC9zaGFyZS9mYXVzdCIsIi91c3Ivc2hhcmUvZmF1c3QiLCIuIiwiL2hvbWUvZG9taW5pcXVlL3B1YmxpY19odG1sL25vdGF0ZXVyL2ZhdXN0L3BoYXNlciJdLCJzaXplIjogMTkyLCJpbnB1dHMiOiAyLCJvdXRwdXRzIjogMiwibWV0YSI6IFsgeyAiYXV0aG9yIjogIkpPUywgcmV2aXNlZCBieSBSTSIgfSx7ICJiYXNpY3MubGliL25hbWUiOiAiRmF1c3QgQmFzaWMgRWxlbWVudCBMaWJyYXJ5IiB9LHsgImJhc2ljcy5saWIvdmVyc2lvbiI6ICIwLjMiIH0seyAiY29tcGlsZV9vcHRpb25zIjogIi1sYW5nIHdhc20taWIgLWVzIDEgLXNpbmdsZSAtZnR6IDIiIH0seyAiZGVtb3MubGliL25hbWUiOiAiRmF1c3QgRGVtb3MgTGlicmFyeSIgfSx7ICJkZW1vcy5saWIvdmVyc2lvbiI6ICIwLjEiIH0seyAiZGVzY3JpcHRpb24iOiAiUGhhc2VyIGRlbW8gYXBwbGljYXRpb24uIiB9LHsgImZpbGVuYW1lIjogInBoYXNlci5kc3AiIH0seyAiZmlsdGVycy5saWIvZmlyOmF1dGhvciI6ICJKdWxpdXMgTy4gU21pdGggSUlJIiB9LHsgImZpbHRlcnMubGliL2Zpcjpjb3B5cmlnaHQiOiAiQ29weXJpZ2h0IChDKSAyMDAzLTIwMTkgYnkgSnVsaXVzIE8uIFNtaXRoIElJSSA8am9zQGNjcm1hLnN0YW5mb3JkLmVkdT4iIH0seyAiZmlsdGVycy5saWIvZmlyOmxpY2Vuc2UiOiAiTUlULXN0eWxlIFNUSy00LjMgbGljZW5zZSIgfSx7ICJmaWx0ZXJzLmxpYi9paXI6YXV0aG9yIjogIkp1bGl1cyBPLiBTbWl0aCBJSUkiIH0seyAiZmlsdGVycy5saWIvaWlyOmNvcHlyaWdodCI6ICJDb3B5cmlnaHQgKEMpIDIwMDMtMjAxOSBieSBKdWxpdXMgTy4gU21pdGggSUlJIDxqb3NAY2NybWEuc3RhbmZvcmQuZWR1PiIgfSx7ICJmaWx0ZXJzLmxpYi9paXI6bGljZW5zZSI6ICJNSVQtc3R5bGUgU1RLLTQuMyBsaWNlbnNlIiB9LHsgImZpbHRlcnMubGliL2xvd3Bhc3MwX2hpZ2hwYXNzMSI6ICJNSVQtc3R5bGUgU1RLLTQuMyBsaWNlbnNlIiB9LHsgImZpbHRlcnMubGliL25hbWUiOiAiRmF1c3QgRmlsdGVycyBMaWJyYXJ5IiB9LHsgImZpbHRlcnMubGliL25sZjI6YXV0aG9yIjogIkp1bGl1cyBPLiBTbWl0aCBJSUkiIH0seyAiZmlsdGVycy5saWIvbmxmMjpjb3B5cmlnaHQiOiAiQ29weXJpZ2h0IChDKSAyMDAzLTIwMTkgYnkgSnVsaXVzIE8uIFNtaXRoIElJSSA8am9zQGNjcm1hLnN0YW5mb3JkLmVkdT4iIH0seyAiZmlsdGVycy5saWIvbmxmMjpsaWNlbnNlIjogIk1JVC1zdHlsZSBTVEstNC4zIGxpY2Vuc2UiIH0seyAiZmlsdGVycy5saWIvdGYyOmF1dGhvciI6ICJKdWxpdXMgTy4gU21pdGggSUlJIiB9LHsgImZpbHRlcnMubGliL3RmMjpjb3B5cmlnaHQiOiAiQ29weXJpZ2h0IChDKSAyMDAzLTIwMTkgYnkgSnVsaXVzIE8uIFNtaXRoIElJSSA8am9zQGNjcm1hLnN0YW5mb3JkLmVkdT4iIH0seyAiZmlsdGVycy5saWIvdGYyOmxpY2Vuc2UiOiAiTUlULXN0eWxlIFNUSy00LjMgbGljZW5zZSIgfSx7ICJmaWx0ZXJzLmxpYi92ZXJzaW9uIjogIjAuMyIgfSx7ICJtYXRocy5saWIvYXV0aG9yIjogIkdSQU1FIiB9LHsgIm1hdGhzLmxpYi9jb3B5cmlnaHQiOiAiR1JBTUUiIH0seyAibWF0aHMubGliL2xpY2Vuc2UiOiAiTEdQTCB3aXRoIGV4Y2VwdGlvbiIgfSx7ICJtYXRocy5saWIvbmFtZSI6ICJGYXVzdCBNYXRoIExpYnJhcnkiIH0seyAibWF0aHMubGliL3ZlcnNpb24iOiAiMi41IiB9LHsgIm5hbWUiOiAicGhhc2VyIiB9LHsgIm9zY2lsbGF0b3JzLmxpYi9uYW1lIjogIkZhdXN0IE9zY2lsbGF0b3IgTGlicmFyeSIgfSx7ICJvc2NpbGxhdG9ycy5saWIvdmVyc2lvbiI6ICIwLjMiIH0seyAicGhhZmxhbmdlcnMubGliL25hbWUiOiAiRmF1c3QgUGhhc2VyIGFuZCBGbGFuZ2VyIExpYnJhcnkiIH0seyAicGhhZmxhbmdlcnMubGliL3ZlcnNpb24iOiAiMC4xIiB9LHsgInBsYXRmb3JtLmxpYi9uYW1lIjogIkdlbmVyaWMgUGxhdGZvcm0gTGlicmFyeSIgfSx7ICJwbGF0Zm9ybS5saWIvdmVyc2lvbiI6ICIwLjIiIH0seyAicm91dGVzLmxpYi9uYW1lIjogIkZhdXN0IFNpZ25hbCBSb3V0aW5nIExpYnJhcnkiIH0seyAicm91dGVzLmxpYi92ZXJzaW9uIjogIjAuMiIgfSx7ICJ2ZXJzaW9uIjogIjAuMCIgfV0sInVpIjogWyB7InR5cGUiOiAidmdyb3VwIiwibGFiZWwiOiAiUEhBU0VSMiIsIm1ldGEiOiBbeyAidG9vbHRpcCI6ICJSZWZlcmVuY2U6ICAgICAgICAgaHR0cHM6Ly9jY3JtYS5zdGFuZm9yZC5lZHUvfmpvcy9wYXNwL0ZsYW5naW5nLmh0bWwiIH1dLCJpdGVtcyI6IFsgeyJ0eXBlIjogImhncm91cCIsImxhYmVsIjogIjB4MDAiLCJtZXRhIjogW3sgIjAiOiAiIiB9XSwiaXRlbXMiOiBbIHsidHlwZSI6ICJjaGVja2JveCIsImxhYmVsIjogIkJ5cGFzcyIsImFkZHJlc3MiOiAiL1BIQVNFUjIvMHgwMC9CeXBhc3MiLCJpbmRleCI6IDAsIm1ldGEiOiBbeyAiMCI6ICIiIH0seyAidG9vbHRpcCI6ICJXaGVuIHRoaXMgaXMgY2hlY2tlZCwgdGhlIHBoYXNlciAgICAgICAgIGhhcyBubyBlZmZlY3QiIH1dfSx7InR5cGUiOiAiY2hlY2tib3giLCJsYWJlbCI6ICJJbnZlcnQgSW50ZXJuYWwgUGhhc2VyIFN1bSIsImFkZHJlc3MiOiAiL1BIQVNFUjIvMHgwMC9JbnZlcnQgSW50ZXJuYWwgUGhhc2VyIFN1bSIsImluZGV4IjogMTMyLCJtZXRhIjogW3sgIjEiOiAiIiB9XX0seyJ0eXBlIjogImNoZWNrYm94IiwibGFiZWwiOiAiVmlicmF0byBNb2RlIiwiYWRkcmVzcyI6ICIvUEhBU0VSMi8weDAwL1ZpYnJhdG8gTW9kZSIsImluZGV4IjogOCwibWV0YSI6IFt7ICIyIjogIiIgfV19XX0seyJ0eXBlIjogImhncm91cCIsImxhYmVsIjogIjB4MDAiLCJtZXRhIjogW3sgIjEiOiAiIiB9XSwiaXRlbXMiOiBbIHsidHlwZSI6ICJoc2xpZGVyIiwibGFiZWwiOiAiU3BlZWQiLCJhZGRyZXNzIjogIi9QSEFTRVIyLzB4MDAvU3BlZWQiLCJpbmRleCI6IDU2LCJtZXRhIjogW3sgIjEiOiAiIiB9LHsgInN0eWxlIjogImtub2IiIH0seyAidW5pdCI6ICJIeiIgfV0sImluaXQiOiAwLjUsIm1pbiI6IDAsIm1heCI6IDEwLCJzdGVwIjogMC4wMDF9LHsidHlwZSI6ICJoc2xpZGVyIiwibGFiZWwiOiAiTm90Y2ggRGVwdGggKEludGVuc2l0eSkiLCJhZGRyZXNzIjogIi9QSEFTRVIyLzB4MDAvTm90Y2ggRGVwdGggKEludGVuc2l0eSkiLCJpbmRleCI6IDEyLCJtZXRhIjogW3sgIjIiOiAiIiB9LHsgInN0eWxlIjogImtub2IiIH1dLCJpbml0IjogMSwibWluIjogMCwibWF4IjogMSwic3RlcCI6IDAuMDAxfSx7InR5cGUiOiAiaHNsaWRlciIsImxhYmVsIjogIkZlZWRiYWNrIEdhaW4iLCJhZGRyZXNzIjogIi9QSEFTRVIyLzB4MDAvRmVlZGJhY2sgR2FpbiIsImluZGV4IjogMjgsIm1ldGEiOiBbeyAiMyI6ICIiIH0seyAic3R5bGUiOiAia25vYiIgfV0sImluaXQiOiAwLCJtaW4iOiAtMC45OTksIm1heCI6IDAuOTk5LCJzdGVwIjogMC4wMDF9XX0seyJ0eXBlIjogImhncm91cCIsImxhYmVsIjogIjB4MDAiLCJtZXRhIjogW3sgIjIiOiAiIiB9XSwiaXRlbXMiOiBbIHsidHlwZSI6ICJoc2xpZGVyIiwibGFiZWwiOiAiTm90Y2ggd2lkdGgiLCJhZGRyZXNzIjogIi9QSEFTRVIyLzB4MDAvTm90Y2ggd2lkdGgiLCJpbmRleCI6IDI0LCJtZXRhIjogW3sgIjEiOiAiIiB9LHsgInNjYWxlIjogImxvZyIgfSx7ICJzdHlsZSI6ICJrbm9iIiB9LHsgInVuaXQiOiAiSHoiIH1dLCJpbml0IjogMTAwMCwibWluIjogMTAsIm1heCI6IDUwMDAsInN0ZXAiOiAxfSx7InR5cGUiOiAiaHNsaWRlciIsImxhYmVsIjogIk1pbiBOb3RjaDEgRnJlcSIsImFkZHJlc3MiOiAiL1BIQVNFUjIvMHgwMC9NaW4gTm90Y2gxIEZyZXEiLCJpbmRleCI6IDQ4LCJtZXRhIjogW3sgIjIiOiAiIiB9LHsgInNjYWxlIjogImxvZyIgfSx7ICJzdHlsZSI6ICJrbm9iIiB9LHsgInVuaXQiOiAiSHoiIH1dLCJpbml0IjogMTAwLCJtaW4iOiAyMCwibWF4IjogNTAwMCwic3RlcCI6IDF9LHsidHlwZSI6ICJoc2xpZGVyIiwibGFiZWwiOiAiTWF4IE5vdGNoMSBGcmVxIiwiYWRkcmVzcyI6ICIvUEhBU0VSMi8weDAwL01heCBOb3RjaDEgRnJlcSIsImluZGV4IjogNTIsIm1ldGEiOiBbeyAiMyI6ICIiIH0seyAic2NhbGUiOiAibG9nIiB9LHsgInN0eWxlIjogImtub2IiIH0seyAidW5pdCI6ICJIeiIgfV0sImluaXQiOiA4MDAsIm1pbiI6IDIwLCJtYXgiOiAxMDAwMCwic3RlcCI6IDF9LHsidHlwZSI6ICJoc2xpZGVyIiwibGFiZWwiOiAiTm90Y2ggRnJlcSBSYXRpbzogTm90Y2hGcmVxKG4rMSkvTm90Y2hGcmVxKG4pIiwiYWRkcmVzcyI6ICIvUEhBU0VSMi8weDAwL05vdGNoIEZyZXEgUmF0aW86IE5vdGNoRnJlcShuKzEpL05vdGNoRnJlcShuKSIsImluZGV4IjogNDAsIm1ldGEiOiBbeyAiNCI6ICIiIH0seyAic3R5bGUiOiAia25vYiIgfV0sImluaXQiOiAxLjUsIm1pbiI6IDEuMSwibWF4IjogNCwic3RlcCI6IDAuMDAxfV19LHsidHlwZSI6ICJoZ3JvdXAiLCJsYWJlbCI6ICIweDAwIiwibWV0YSI6IFt7ICIzIjogIiIgfV0sIml0ZW1zIjogWyB7InR5cGUiOiAiaHNsaWRlciIsImxhYmVsIjogIlBoYXNlciBPdXRwdXQgTGV2ZWwiLCJhZGRyZXNzIjogIi9QSEFTRVIyLzB4MDAvUGhhc2VyIE91dHB1dCBMZXZlbCIsImluZGV4IjogNCwibWV0YSI6IFt7ICJ1bml0IjogImRCIiB9XSwiaW5pdCI6IDAsIm1pbiI6IC02MCwibWF4IjogMTAsInN0ZXAiOiAwLjF9XX1dfV19"; }

/*
 faust2wasm: GRAME 2017-2019
*/

'use strict';

// Monophonic Faust DSP
class phaserProcessor extends AudioWorkletProcessor {

    // JSON parsing functions
    static parse_ui(ui, obj, callback) {
        for (var i = 0; i < ui.length; i++) {
            phaserProcessor.parse_group(ui[i], obj, callback);
        }
    }

    static parse_group(group, obj, callback) {
        if (group.items) {
            phaserProcessor.parse_items(group.items, obj, callback);
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
            phaserProcessor.parse_items(item.items, obj, callback);
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
            phaserProcessor.parse_items(item.items, obj, callback);
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
        phaserProcessor.parse_ui(JSON.parse(getJSONphaser()).ui, params, phaserProcessor.parse_item1);
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

        this.phaser_instance = new WebAssembly.Instance(options.processorOptions.wasm_module, importObject);
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

        this.factory = this.phaser_instance.exports;
        this.HEAP = this.phaser_instance.exports.memory.buffer;
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
            phaserProcessor.parse_ui(this.json_object.ui, this, phaserProcessor.parse_item2);

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
    registerProcessor('phaser', phaserProcessor);
} catch (error) {
    console.warn(error);
}
