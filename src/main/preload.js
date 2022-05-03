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
  saveProject: (project) => ipcRenderer.invoke('save-project', project),
  openProject: () => ipcRenderer.invoke('open-project'),
  setUndoRedoEnabled: (undoEnabled, redoEnabled) =>
    ipcRenderer.invoke('set-undo-redo-enabled', undoEnabled, redoEnabled),
  extractThumbnail: (filePath) =>
    ipcRenderer.invoke('extract-thumbnail', filePath),

  // Have to manually redefine, otherwise Electron nukes this since main->renderer comms is not a standard use case
  on(channel, listener) {
    return ipcRenderer.on(channel, listener);
  },
});
