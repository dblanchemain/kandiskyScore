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
            let validChannels = ["fromMain",'fromparam'];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        },
        contextmenu: (channel, data) => {
            // whitelist channels
            let validChannels = ["showmenu"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel,'showmenu')
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
                ipcRenderer.send(channel,'saveAudio',...args)
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
    showSaveDialog: () => ipcRenderer.invoke("showSaveDialog"),
    loadFile: (filePath) =>ipcRenderer.invoke("loadFile", filePath),
  	 saveAudioBuffer: (...args) => ipcRenderer.invoke("save-audio-buffer", ...args),
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
	 renderGroupWidthSoX: (lsgrp,tbobjets,start) =>
        ipcRenderer.invoke("renderGroupWidthSoX",lsgrp,tbobjets,start),
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
  	 loadBuffersMultichannel: (path) =>
    ipcRenderer.invoke("load-buffers-multichannel", path)
    }
)
