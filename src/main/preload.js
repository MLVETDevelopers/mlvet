const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Everything between the START GENERATED CODE and END GENERATED CODE comments will be replaced with the injected handler invocations when 'yarn gen' is run

  // START GENERATED CODE
  deleteProject: (project) => ipcRenderer.invoke('delete-project', project),

  openExternalLink: (url) => ipcRenderer.invoke('open-external-link', url),

  openProject: (filePath) => ipcRenderer.invoke('open-project', filePath),

  retrieveProjectMetadata: (project) =>
    ipcRenderer.invoke('retrieve-project-metadata', project),

  readCloudConfig: () => ipcRenderer.invoke('read-cloud-config'),

  readDefaultEngineConfig: () =>
    ipcRenderer.invoke('read-default-engine-config'),

  readRecentProjects: () => ipcRenderer.invoke('read-recent-projects'),

  requestMediaDialog: () => ipcRenderer.invoke('request-media-dialog'),

  requireCloudConfig: () => ipcRenderer.invoke('require-cloud-config'),

  saveAsProject: (project) => ipcRenderer.invoke('save-as-project', project),

  saveChangesDialog: (mainWindow, projectFileName) =>
    ipcRenderer.invoke('save-changes-dialog', mainWindow, projectFileName),

  saveProject: (project) => ipcRenderer.invoke('save-project', project),

  storeCloudCredentials: (defaultEngine, engineConfigs) =>
    ipcRenderer.invoke('store-cloud-credentials', defaultEngine, engineConfigs),

  writeRecentProjects: (recentProjects) =>
    ipcRenderer.invoke('write-recent-projects', recentProjects),

  extractAudio: (project) => ipcRenderer.invoke('extract-audio', project),

  exportProject: (project) => ipcRenderer.invoke('export-project', project),

  extractThumbnail: (absolutePathToMediaFile, project) =>
    ipcRenderer.invoke('extract-thumbnail', absolutePathToMediaFile, project),

  loadThumbnail: (projectId) => ipcRenderer.invoke('load-thumbnail', projectId),

  transcribe: (project, transcriptionEngine) =>
    ipcRenderer.invoke('transcribe', project, transcriptionEngine),

  requestTranscription: (project) =>
    ipcRenderer.invoke('request-transcription', project),

  setConfidenceLinesEnabled: (menuItemEnabled) =>
    ipcRenderer.invoke('set-confidence-lines-enabled', menuItemEnabled),

  setEditWordEnabled: (editEnabled) =>
    ipcRenderer.invoke('set-edit-word-enabled', editEnabled),

  setExportEnabled: (exportEnabled) =>
    ipcRenderer.invoke('set-export-enabled', exportEnabled),

  setFileRepresentation: (representedFilePath, isEdited) =>
    ipcRenderer.invoke(
      'set-file-representation',
      representedFilePath,
      isEdited
    ),

  setHomeEnabled: (homeEnabled) =>
    ipcRenderer.invoke('set-home-enabled', homeEnabled),

  setMergeSplitEnabled: (mergeEnabled, splitEnabled) =>
    ipcRenderer.invoke('set-merge-split-enabled', mergeEnabled, splitEnabled),

  setSaveEnabled: (saveEnabled, saveAsEnabled) =>
    ipcRenderer.invoke('set-save-enabled', saveEnabled, saveAsEnabled),

  setUndoRedoEnabled: (undoEnabled, redoEnabled) =>
    ipcRenderer.invoke('set-undo-redo-enabled', undoEnabled, redoEnabled),

  getFileNameWithExtension: (filePath) =>
    ipcRenderer.invoke('get-file-name-with-extension', filePath),

  handleOsQuery: () => ipcRenderer.invoke('handle-os-query'),

  setClipboardEnabled: (cutEnabled, copyEnabled, pasteEnabled, deleteEnabled) =>
    ipcRenderer.invoke(
      'set-clipboard-enabled',
      cutEnabled,
      copyEnabled,
      pasteEnabled,
      deleteEnabled
    ),

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
