const { contextBridge, ipcRenderer } = require('electron');

/*
 * When exposing a new method make sure to update global.d.ts
 * (src/renderer/global.d.ts) with the method signature with types
 * to help out typescipt
 */

contextBridge.exposeInMainWorld('electron', {
  requestMediaDialog: () => ipcRenderer.invoke('import-media'),

  requestTranscription: (project) =>
    ipcRenderer.invoke('transcribe-media', project),

  saveProject: (project) => ipcRenderer.invoke('save-project', project),

  saveAsProject: (project) => ipcRenderer.invoke('save-as-project', project),

  openProject: (filePath) => ipcRenderer.invoke('open-project', filePath),

  setSaveEnabled: (saveEnabled, saveAsEnabled) =>
    ipcRenderer.invoke('set-save-enabled', saveEnabled, saveAsEnabled),

  setUndoRedoEnabled: (undoEnabled, redoEnabled) =>
    ipcRenderer.invoke('set-undo-redo-enabled', undoEnabled, redoEnabled),

  extractThumbnail: (filePath) =>
    ipcRenderer.invoke('extract-thumbnail', filePath),

  userOS: async () => ipcRenderer.invoke('user-os'),

  readRecentProjects: () => ipcRenderer.invoke('read-recent-projects'),

  writeRecentProjects: (recentProjects) =>
    ipcRenderer.invoke('write-recent-projects', recentProjects),

  retrieveProjectMetadata: (project) =>
    ipcRenderer.invoke('retrieve-project-metadata', project),
  extractAudio: (project) => ipcRenderer.invoke('extract-audio', project),
  // Have to manually redefine, otherwise Electron nukes this since main->renderer comms is not a standard use case
  on(channel, listener) {
    return ipcRenderer.on(channel, listener);
  },
});
