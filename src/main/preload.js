const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // Everything between the START GENERATED CODE and END GENERATED CODE comments will be replaced with the injected handler invocations when 'yarn gen' is run

  // START GENERATED CODE
  extractAudio: (project) => ipcRenderer.invoke('extract-audio', project),

  showImportMediaDialog: () => ipcRenderer.invoke('show-import-media-dialog'),

  getFileNameWithExtension: (filePath) =>
    ipcRenderer.invoke('get-file-name-with-extension', filePath),

  handleOpenProject: (filePath) =>
    ipcRenderer.invoke('handle-open-project', filePath),

  handleOsQuery: () => ipcRenderer.invoke('handle-os-query'),

  retrieveProjectMetadata: (project) =>
    ipcRenderer.invoke('retrieve-project-metadata', project),

  readRecentProjects: () => ipcRenderer.invoke('read-recent-projects'),

  handleSaveAsProject: (project) =>
    ipcRenderer.invoke('handle-save-as-project', project),

  handleSaveProject: (project) =>
    ipcRenderer.invoke('handle-save-project', project),

  extractThumbnail: (absolutePathToMediaFile) =>
    ipcRenderer.invoke('extract-thumbnail', absolutePathToMediaFile),

  handleTranscription: (project) =>
    ipcRenderer.invoke('handle-transcription', project),

  writeRecentProjects: (recentProjects) =>
    ipcRenderer.invoke('write-recent-projects', recentProjects),
  // END GENERATED CODE

  // Have to manually redefine, otherwise Electron nukes this since main->renderer comms is not a standard use case
  on(channel, listener) {
    return ipcRenderer.on(channel, listener);
  },
});
