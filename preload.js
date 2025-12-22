// preload.js


const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');
// Toutes les API Node.js sont disponibles dans le processus de préchargement.
// Il a la même sandbox qu'une extension Chrome.

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
  	 loadFile: (filePath) =>ipcRenderer.invoke("loadFile", filePath),
  	 saveAudioBuffer: (...args) => ipcRenderer.invoke("save-audio-buffer", ...args),
    mergeWithSox: (output, inputs) =>
        ipcRenderer.invoke("runSoxMerge", output, inputs),
        // Audio load
    loadBuffers: (filePath) =>
        ipcRenderer.invoke("loadBuffers", filePath),

    loadFileAsArrayBuffer: (filePath) =>
        ipcRenderer.invoke("loadAB", filePath),

    infoFile: (filePath) =>
        ipcRenderer.invoke("infoFile", filePath),
	 renderGroupWidthSoX: (lsgrp,tbobjets,start) =>
        ipcRenderer.invoke("renderGroupWidthSoX",lsgrp,tbobjets,start),
    // Audio save
    saveAudioTempo: (filePath, arrayBuffer) =>
        ipcRenderer.invoke("saveAudioTempo", { filePath, arrayBuffer }),
    // File I/O
	 readFxFile: (relativePath) => ipcRenderer.invoke('readFxFile', relativePath),

    
    readFile: (filePath) =>
        ipcRenderer.invoke('readFile', filePath),

    saveFile: (filename, data) =>
        ipcRenderer.invoke("saveFile", { filename, data }),
    }
)
