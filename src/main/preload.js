const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // TODO: don't expose whole IPC module
  ipcRenderer,
});
