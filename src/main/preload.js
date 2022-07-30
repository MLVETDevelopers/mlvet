const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Everything between the START GENERATED CODE and END GENERATED CODE comments will be replaced with the injected handler invocations when 'yarn gen' is run

  // START GENERATED CODE
  deleteProject: (project) => ipcRenderer.invoke('delete-project', project),

  openProject: (filePath) => ipcRenderer.invoke('open-project', filePath),

  retrieveProjectMetadata: (project) =>
    ipcRenderer.invoke('retrieve-project-metadata', project),

  readRecentProjects: () => ipcRenderer.invoke('read-recent-projects'),

  requestMediaDialog: () => ipcRenderer.invoke('request-media-dialog'),

  saveAsProject: (project) => ipcRenderer.invoke('save-as-project', project),

  saveProject: (project) => ipcRenderer.invoke('save-project', project),

  writeRecentProjects: (recentProjects) =>
    ipcRenderer.invoke('write-recent-projects', recentProjects),

  extractAudio: (project) => ipcRenderer.invoke('extract-audio', project),

  exportProject: (project) => ipcRenderer.invoke('export-project', project),

  extractThumbnail: (absolutePathToMediaFile, project) =>
    ipcRenderer.invoke('extract-thumbnail', absolutePathToMediaFile, project),

  requestTranscription: (project) =>
    ipcRenderer.invoke('request-transcription', project),

  setFileRepresentation: (representedFilePath, isEdited) =>
    ipcRenderer.invoke(
      'set-file-representation',
      representedFilePath,
      isEdited
    ),

  setHomeEnabled: (homeEnabled) =>
    ipcRenderer.invoke('set-home-enabled', homeEnabled),

  setSaveEnabled: (saveEnabled, saveAsEnabled) =>
    ipcRenderer.invoke('set-save-enabled', saveEnabled, saveAsEnabled),

  setUndoRedoEnabled: (undoEnabled, redoEnabled) =>
    ipcRenderer.invoke('set-undo-redo-enabled', undoEnabled, redoEnabled),

  getFileNameWithExtension: (filePath) =>
    ipcRenderer.invoke('get-file-name-with-extension', filePath),

  handleOsQuery: () => ipcRenderer.invoke('handle-os-query'),

  closeWindow: () => ipcRenderer.invoke('close-window'),

  promptSave: () => ipcRenderer.invoke('prompt-save'),

  returnToHome: (project) => ipcRenderer.invoke('return-to-home', project),

  showConfirmation: (message, detail) =>
    ipcRenderer.invoke('show-confirmation', message, detail),
  // END GENERATED CODE

  // Have to manually redefine, otherwise Electron nukes this since main->renderer comms is not a standard use case
  on(channel, listener) {
    return ipcRenderer.on(channel, listener);
  },
});
