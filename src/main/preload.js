const { contextBridge, ipcRenderer } = require('electron');

/*
 * When exposing a new method make sure to update global.d.ts
 * (src/renderer/global.d.ts) with the method signature with types
 * to help out typescipt
 */

contextBridge.exposeInMainWorld('electron', {
  requestMediaDialog: () => ipcRenderer.invoke('import-media'),
  requestTranscription: (filePath) =>
    ipcRenderer.invoke('transcribe-media', filePath),
});
