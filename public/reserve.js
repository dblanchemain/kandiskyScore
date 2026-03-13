async function readSimpleAudioA() {
    try {
        const obj = tableObjet[objActif];
        if (!obj || !obj.file) throw new Error("Objet ou fichier introuvable");

        const filePath = obj.file;
        const dir = rdDirName(filePath);
        const baseName = rdBaseName(filePath).split(".")[0];
        const outPath = `${dir}/${baseName}-fx.wav`;

        console.log("[pipeline] readSimpleAudioA_v7 start", { filePath, outPath });

        // ----- LOAD BUFFERS -----
        const rt = await window.api.loadBuffers(filePath);
        const channels = rt.channels.map(ch => new Float32Array(ch));

        if (!channels.length)
            throw new Error("loadBuffers: aucun canal!");

        // ----- OfflineAudioContext -----
        const ctx = new OfflineAudioContext(rt.numChannels, rt.numSamples, rt.sampleRate);

        // ----- Create AudioBuffer -----
        const buffer = ctx.createBuffer(rt.numChannels, rt.numSamples, rt.sampleRate);
        for (let ch = 0; ch < rt.numChannels; ch++) {
            buffer.getChannelData(ch).set(channels[ch]);
        }

        // ----- Source -----
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.start(0);
        
        

        // ----- FIX : une seule connexion -----
        src.connect(ctx.destination);

        // ----- Render -----
        console.log("[pipeline] rendering...");
        const rendered = await ctx.startRendering();
        console.log("[pipeline] rendering done");

        // ----- Extraction -----
        const outChannels = [];
        for (let ch = 0; ch < rendered.numberOfChannels; ch++) {
            const pcm = rendered.getChannelData(ch);
            const copy = new Float32Array(pcm.length);
            copy.set(pcm);
            outChannels.push(copy.buffer);
        }

        await window.api.saveAudioBuffer({
            filePath: outPath,
            buffer: { sampleRate: rendered.sampleRate, channels: outChannels }
        });

        console.log("[pipeline] saved →", outPath);

    } catch (err) {
        console.error("[pipeline] readSimpleAudioA_v7 error:", err);
        throw err;
    }
}


async function readSimpleAudioA() {
    try {
        const obj = tableObjet[objActif];
        if (!obj || !obj.file) throw new Error("Objet ou fichier introuvable");

        // ----- PATHS -----
        const filePath = obj.file;
        const dir = rdDirName(filePath);
        const baseName = rdBaseName(filePath).split(".")[0];
        const outPath = `${dir}/${baseName}-fx.wav`;

        console.log("[pipeline] readSimpleAudioA_v7 start", { filePath, outPath });

        // ----- LOAD BUFFERS (via preload) -----
        const rt = await window.api.loadBuffers(filePath);
        if (!rt || !Array.isArray(rt.channels) || rt.channels.length === 0) {
            throw new Error("loadBuffers: aucun canal renvoyé par preload");
        }
        const numChannels = rt.numChannels;
        const numSamples = rt.numSamples;
        const sampleRate = rt.sampleRate;

        console.log("[pipeline] source info", { numChannels, numSamples, sampleRate });

        // convert channels ArrayBuffer => Float32Array
        const sourceChannels = rt.channels.map(chAb => new Float32Array(chAb));

        // ----- DETERMINE PREMIER GREFFON (slot 0) -----
        // On prend obj.tableFx et listeFx tel que tu l'utilises : listeFx[ obj.tableFx[slot] ].greffon
        const slot0 = obj.tableFx && obj.tableFx[0] ? obj.tableFx[0] : null;
        if (!slot0) {
            console.log("[pipeline] Aucun greffon défini -> passthrough (on copie le fichier)");
            // fallback: juste recopier le fichier original
            await window.api.saveAudioBuffer({
                filePath: outPath,
                buffer: { sampleRate, channels: sourceChannels.map(c => c.buffer) }
            });
            console.log("[pipeline] passthrough saved →", outPath);
            return;
        }

        const fxKey = slot0;
        const fxDesc = listeFx && listeFx[fxKey];
        if (!fxDesc) {
            console.warn("[pipeline] Descriptor introuvable pour fxKey:", fxKey, "-> passthrough");
            await window.api.saveAudioBuffer({
                filePath: outPath,
                buffer: { sampleRate, channels: sourceChannels.map(c => c.buffer) }
            });
            return;
        }

        const dspName = fxDesc.greffon; // ex: "pitchShifter"
        console.log("[pipeline] apply greffon slot 0 :", fxKey, "→", dspName);

        // ----- TRY: compile DSP from .dsp source using @grame/faustwasm -----
        // This path compiles dsp source to a processor that we can call offline.
        let processor = null;
        try {
            console.log("[pipeline] loading faustwasm package...");
            // import ESM runtime (adjust path if needed)
            const faustPkg = await import("./node_modules/@grame/faustwasm/dist/esm/index.js");

            const {
                instantiateFaustModuleFromFile,
                LibFaust,
                FaustCompiler,
                FaustMonoDspGenerator,
                FaustMonoOfflineProcessor, // may or may not be present
                WavEncoder
            } = faustPkg;

            // instantiate libfaust wasm (path may need adapt)
            console.log("[pipeline] instantiateFaustModuleFromFile...");
            const faustModule = await instantiateFaustModuleFromFile(
                "./node_modules/@grame/faustwasm/libfaust-wasm/libfaust-wasm.js"
            );
            const libFaust = new LibFaust(faustModule);
            console.log("[pipeline] libFaust ready, version:", libFaust.version && libFaust.version());

            const compiler = new FaustCompiler(libFaust);
            const generator = new FaustMonoDspGenerator();

            // Read .dsp source from plugin folder (prefer source compilation because it avoids wasm-in-worker issues)
            const dspSrcPath = `./greffons/${dspName}-wasm/${dspName}.dsp`;
            let dspSource = null;
            try {
                dspSource = await window.api.readFxFile(dspSrcPath); // must return string
                if (dspSource instanceof Uint8Array || dspSource instanceof ArrayBuffer) {
                    dspSource = new TextDecoder().decode(dspSource);
                }
            } catch (e) {
                console.warn(`[pipeline] .dsp source not found at ${dspSrcPath}, will try other ways (wasm).`, e);
            }

            if (!dspSource) {
                // If no .dsp source, try to fallback to using precompiled dsp-module.wasm + dsp-meta.json
                // but many faustwasm helper functions expect source+compiler; fallback may fail.
                console.warn("[pipeline] no .dsp source available -> fallback to dsp-module.wasm attempt");
                const base = `./greffons/${dspName}-wasm/`;
                // try to load dsp-meta.json and dsp-module.wasm (we may still be able to instantiate an offline processor)
                const metaTxt = await window.api.readFxFile(`${base}dsp-meta.json`);
                const wasmBin = await window.api.readFxFile(`${base}dsp-module.wasm`);
                let dspMeta = null;
                if (metaTxt) {
                    const metaStr = (metaTxt instanceof Uint8Array || metaTxt instanceof ArrayBuffer) ? new TextDecoder().decode(metaTxt) : String(metaTxt);
                    dspMeta = JSON.parse(metaStr);
                }
                if (!wasmBin || !dspMeta) {
                    throw new Error("Neither .dsp source nor dsp-module.wasm + dsp-meta.json available");
                }
                // Attempt instantiation path: put module in generator factory if API allows.
                // Many faustwasm usages expect to compile from source; this fallback may not produce an offline processor.
                // We'll keep going and try generator.createOfflineProcessor (may throw).
                // Create a WASM-backed factory if supported (best-effort).
                try {
                    // Some versions expose generator.createOfflineProcessorFromWasm-like helpers — try generic compile step is not available.
                    // As fallback, throw to be handled below.
                    throw new Error("fallback wasm->offline not implemented reliably here");
                } catch (e) {
                    console.warn("[pipeline] fallback wasm offline creation failed:", e);
                    throw e;
                }
            } else {
                // We have dsp source: compile & create offline processor
                console.log("[pipeline] compiling DSP source...");
                // args: empty or use compiler options if needed (libraries path)
                const argv = ""; // adapt if you need -I libraries/...
                await generator.compile(compiler, dspName, dspSource, argv);
                console.log("[pipeline] compile OK, creating offline processor...");
                // sampleRate argument below must be the file sampleRate
                // bufferSize / blockSize choose 1024 (common)
                processor = await generator.createOfflineProcessor(sampleRate, 1024);
                if (!processor || typeof processor.render !== "function") {
                    throw new Error("Offline processor creation returned no usable processor");
                }
                console.log("[pipeline] offline processor ready");
            }
        } catch (errFaust) {
            console.warn("[pipeline] faust offline compile/create failed -> will passthrough per-channel (no effect).", errFaust);
            processor = null;
        }

        // ----- PROCESS CHANNELS ONE BY ONE using the offline processor (if available) -----
        const processedChannels = new Array(numChannels);
        if (processor) {
            console.log("[pipeline] processing channels with offline processor (mono DSP) ...");
            for (let ch = 0; ch < numChannels; ch++) {
                try {
                    console.log(`--[channel ${ch}]--`);
                    const inputFloat32 = sourceChannels[ch];

                    // The exact API of processor.render may vary across versions.
                    // We'll try two common forms in order:
                    // 1) out = processor.render([inputFloat32], numSamples)
                    // 2) out = processor.render(null, numSamples) after setting input via processor.setInput?
                    let outBuf = null;

                    // attempt form (1)
                    if (typeof processor.render === "function") {
                        try {
                            const maybe = processor.render([inputFloat32], inputFloat32.length);
                            // render may return an array of Float32Array or an object; normalise:
                            if (Array.isArray(maybe) && maybe.length > 0 && maybe[0] instanceof Float32Array) {
                                outBuf = maybe[0];
                            } else if (maybe && maybe[0] && maybe[0].length) {
                                outBuf = maybe[0];
                            } else if (maybe instanceof Float32Array) {
                                outBuf = maybe;
                            } else {
                                // unknown shape: attempt to coerce
                                console.warn("[pipeline] processor.render returned unexpected shape, attempting to coerce");
                                if (maybe && maybe.channelData && Array.isArray(maybe.channelData)) {
                                    outBuf = new Float32Array(maybe.channelData[0]);
                                }
                            }
                        } catch (errRender) {
                            console.warn("[pipeline] processor.render form (1) failed:", errRender);
                        }
                    }

                    if (!outBuf) {
                        // try form (2) if present
                        if (typeof processor.process === "function") {
                            try {
                                const maybe2 = processor.process([inputFloat32]);
                                if (Array.isArray(maybe2) && maybe2[0] instanceof Float32Array) {
                                    outBuf = maybe2[0];
                                } else if (maybe2 instanceof Float32Array) {
                                    outBuf = maybe2;
                                }
                            } catch (err2) {
                                console.warn("[pipeline] processor.process failed:", err2);
                            }
                        }
                    }

                    if (!outBuf) {
                        console.warn(`[pipeline] cannot get output from processor for channel ${ch} -> passthrough this channel`);
                        processedChannels[ch] = inputFloat32.buffer;
                    } else {
                        // ensure copy => ArrayBuffer for IPC
                        const copy = new Float32Array(outBuf.length);
                        copy.set(outBuf);
                        processedChannels[ch] = copy.buffer;
                    }
                } catch (errCh) {
                    console.error(`[pipeline] error processing channel ${ch}:`, errCh);
                    // fallback: original channel
                    processedChannels[ch] = sourceChannels[ch].buffer;
                }
            }
        } else {
            // no processor -> passthrough all channels
            console.log("[pipeline] no offline processor available -> passthrough all channels");
            for (let ch = 0; ch < numChannels; ch++) processedChannels[ch] = sourceChannels[ch].buffer;
        }

        // ----- SAVE assembled multichannel WAV -----
        await window.api.saveAudioBuffer({
            filePath: outPath,
            buffer: {
                sampleRate,
                channels: processedChannels
            }
        });

        console.log("[pipeline] saved →", outPath);
        return true;

    } catch (err) {
        console.error("[pipeline] readSimpleAudioA_v7 error:", err);
        throw err;
    }
}
