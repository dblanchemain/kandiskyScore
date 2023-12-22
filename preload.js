// preload.js
const { contextBridge, ipcRenderer } = require('electron')
// Toutes les API Node.js sont disponibles dans le processus de préchargement.
// Il a la même sandbox qu'une extension Chrome.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }

})
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
        saveAudio: (channel, ...args) => {
            // whitelist channels
            let validChannels = ["saveAudio"];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel,'saveAudio',...args)
            }
        }
    }
)
