const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // TODO: dont expose whole renderer for security reasons
  ipcRenderer,
});
