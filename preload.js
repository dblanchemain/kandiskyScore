// preload.js

const { contextBridge, ipcRenderer} = require('electron');
const path = require('path');
const fs = require('fs/promises');

// Toutes les API Node.js sont disponibles dans le processus de préchargement.
// Il a la même sandbox qu'une extension Chrome.

const isDev = process.resourcesPath.includes('node_modules/electron');
const resourcesPath = isDev
  ? path.join(process.cwd(), 'resources')
  : process.resourcesPath;
  
contextBridge.exposeInMainWorld(
"api", {
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ["toMain"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ["fromMain", "fromparam", "lv2-ui-change"];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        contextmenu: (channel, data) => {
            // whitelist channels
            let validChannels = ["showmenu"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel,'showmenu');
            }
        },
        saveBuffer: (data) => {
        return ipcRenderer.invoke("toMainAsync", {
            cmd: "saveAudioBuffer",
            ...data
        });
    },
        saveAudio: (channel, ...args) => {
            // whitelist channels
            let validChannels = ["saveAudio"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel,'saveAudio',...args);
            }
        },
    spectralShift: (buffers, sampleRate, start, end, fTarget, objSelect) =>
        ipcRenderer.invoke('spectralShift', buffers, sampleRate, start, end, fTarget, objSelect),
    eraseSelection: (currentChannels,sampleRate,objSelect) => {
        return ipcRenderer.invoke('eraseSelection',currentChannels,sampleRate,objSelect);},
    filtreSelection: (buffers,sampleRate,objSelect) => {
        return ipcRenderer.invoke('filtreSelection',buffers,sampleRate,objSelect);},
   frequencyShift: (buffers, sr, start, end, objSelect, mouseY) =>
    ipcRenderer.invoke('frequencyShift', buffers, sr, start, end, objSelect, mouseY),
    showSaveDialog: (defaultPath) => ipcRenderer.invoke("showSaveDialog", defaultPath),
    loadFile: (filePath) =>ipcRenderer.invoke("loadFile", filePath),
  	 saveAudioBuffer: (...args) => ipcRenderer.invoke("save-audio-buffer", ...args),
    sendToWam: (data) => ipcRenderer.invoke("send-to-wam", data),
    playFromBuffer: (data) => ipcRenderer.invoke("play-from-buffer", data),
    mergeWithSox: (output, inputs) =>
        ipcRenderer.invoke("runSoxMerge", output, inputs),
        // Audio load
    loadBuffers: (filePath) =>
        ipcRenderer.invoke("loadBuffers", filePath),

    loadFileAsArrayBuffer: (filePath) =>
        ipcRenderer.invoke("loadAB", filePath),
	 audioSelect: () =>
        ipcRenderer.invoke("audioSelect"),
    infoFile: (filePath) =>
        ipcRenderer.invoke("infoFile", filePath),
	 renderGroupWidthSoX: (lsgrp,tbobjets,start,preferFx,normalize) =>
        ipcRenderer.invoke("renderGroupWidthSoX",lsgrp,tbobjets,start,preferFx,normalize),
    renderHoaAmbiXMix: (objects, exportDir) =>
        ipcRenderer.invoke("renderHoaAmbiXMix", objects, exportDir),
    renderBinauralFromAmbiX: (ambiXPath, outPath) =>
        ipcRenderer.invoke("renderBinauralFromAmbiX", ambiXPath, outPath),
    fileExists: (filePath) =>
        ipcRenderer.invoke("fileExists", filePath),
    copyFileToPath: (src, dest) =>
        ipcRenderer.invoke("copyFileToPath", src, dest),
    cleanHoaAmbiX: (exportDir) =>
        ipcRenderer.invoke("cleanHoaAmbiX", exportDir),
    launchReaperHoaBinaural: (ambiXPath, hoaOrder, sampleRate) =>
        ipcRenderer.invoke("launchReaperHoaBinaural", ambiXPath, hoaOrder, sampleRate),
    launchReaperHoaAllRA: (ambiXPath, hoaOrder, sampleRate, layoutName) =>
        ipcRenderer.invoke("launchReaperHoaAllRA", ambiXPath, hoaOrder, sampleRate, layoutName),
    launchArdourHoaBinaural: (ambiXPath, hoaOrder, sampleRate) =>
        ipcRenderer.invoke("launchArdourHoaBinaural", ambiXPath, hoaOrder, sampleRate),
    launchArdourHoaAllRA: (ambiXPath, hoaOrder, sampleRate, layoutName) =>
        ipcRenderer.invoke("launchArdourHoaAllRA", ambiXPath, hoaOrder, sampleRate, layoutName),
    launchReaperHoaSpartaBinaural: (ambiXPath, hoaOrder, sampleRate) =>
        ipcRenderer.invoke("launchReaperHoaSpartaBinaural", ambiXPath, hoaOrder, sampleRate),
    launchReaperHoaSpartaAllRA: (ambiXPath, hoaOrder, sampleRate, layoutName) =>
        ipcRenderer.invoke("launchReaperHoaSpartaAllRA", ambiXPath, hoaOrder, sampleRate, layoutName),
    launchArdourHoaSpartaBinaural: (ambiXPath, hoaOrder, sampleRate) =>
        ipcRenderer.invoke("launchArdourHoaSpartaBinaural", ambiXPath, hoaOrder, sampleRate),
    launchArdourHoaSpartaAllRA: (ambiXPath, hoaOrder, sampleRate, layoutName) =>
        ipcRenderer.invoke("launchArdourHoaSpartaAllRA", ambiXPath, hoaOrder, sampleRate, layoutName),
    // Audio save
    saveAudioTempo: (filePath, arrayBuffer) =>
        ipcRenderer.invoke("saveAudioTempo", { filePath, arrayBuffer }),
    // File I/O
	 readFxFile: (relativePath) => ipcRenderer.invoke('readFxFile', relativePath),
	 stft: (buffer, fftSize, hopSize, sampleRate)=>
        ipcRenderer.invoke("stft",buffer, fftSize, hopSize, sampleRate),
    extractSpectralRectangle: (args,buffers) =>
        ipcRenderer.invoke('extractSpectralRectangle', args,buffers),
    readFile: (filePath) =>
        ipcRenderer.invoke('readFile', filePath),

    saveFile: (filename, data) =>
        ipcRenderer.invoke("saveFile", { filename, data }),
    resources: resourcesPath,
  	 getPaths: () => ipcRenderer.invoke('get-app-paths'),
  	 joinPath: (...args) => path.join(...args),
     isAbsolute: (p) => path.isAbsolute(p),
     baseName: (p) => path.basename(p),
     dirName: (p) => path.dirname(p),
     toFileUrl: (p) => require('url').pathToFileURL(p).href,
  	 loadBuffersMultichannel: (path) =>
    ipcRenderer.invoke("load-buffers-multichannel", path),
    playDirectFile: (mode, filePath, soxParams) =>
        ipcRenderer.invoke('playDirectFile', mode, filePath, soxParams),
    killAudio: () => ipcRenderer.invoke('killAudio'),
    preloadAudio: (filePaths) =>
        ipcRenderer.invoke('preloadAudio', filePaths),
    setAudioChannels: (channels) =>
        ipcRenderer.invoke('setAudioChannels', channels),
    listAudioDevices: () =>
        ipcRenderer.invoke('listAudioDevices'),
    setAudioDevice: (deviceIndex) =>
        ipcRenderer.invoke('setAudioDevice', deviceIndex),
    soxProcessExport: (filePath, soxParams) =>
        ipcRenderer.invoke('soxProcessExport', filePath, soxParams),
    soxProcessTo: (inputPath, outputPath, soxParams) =>
        ipcRenderer.invoke('soxProcessTo', inputPath, outputPath, soxParams),
    admStreamStart: (data) => ipcRenderer.invoke('adm-stream-start', data),
    admStreamChunk: (buf)  => ipcRenderer.invoke('adm-stream-chunk', buf),
    admStreamEnd:   (data) => ipcRenderer.invoke('adm-stream-end',   data),
    copyGrpAudio: (files, srcDir, destDir) => ipcRenderer.invoke('copyGrpAudio', files, srcDir, destDir),
    copyGrpExports: (srcDir, destDir, srcIds, offset) => ipcRenderer.invoke('copyGrpExports', srcDir, destDir, srcIds, offset),
    isDev,
    platform: process.platform,
    // ── LV2 ──
    lv2List:      ()                      => ipcRenderer.invoke('lv2-list'),
    lv2ListNames: ()                      => ipcRenderer.invoke('lv2-list-names'),
    lv2Info:      (uri)                   => ipcRenderer.invoke('lv2-info', uri),
    lv2Process: (params)                  => ipcRenderer.invoke('lv2-process', params),
    lv2OpenUi:  (uri, initialValues)      => ipcRenderer.invoke('lv2-open-ui', { uri, initialValues }),
    lv2CloseUi: (uri)                     => ipcRenderer.invoke('lv2-close-ui', uri),
    // ── VST3 (pedalboard) ──
    vst3List:    ()                       => ipcRenderer.invoke('vst3-list'),
    vst3Info:    (pluginPath)             => ipcRenderer.invoke('vst3-info', pluginPath),
    vst3Process: (params)                 => ipcRenderer.invoke('vst3-process', params),
    }
);
