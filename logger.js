// logger.js — désactive console.log en production
(function () {
  var isDev =
    // Renderer avec contextBridge (fenêtre principale)
    (typeof window !== 'undefined' && window.api && window.api.isDev !== undefined)
      ? window.api.isDev
      // Renderer avec nodeIntegration ou process accessible
      : (typeof process !== 'undefined' && process.resourcesPath)
        ? process.resourcesPath.includes('node_modules/electron')
        : true; // par défaut : mode dev (sécurité)

  if (!isDev) {
    console.log = function () {};
    console.debug = function () {};
  }
})();
