const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  // TODO: dont expose whole renderer for security reasons
  ipcRenderer: {
    ...ipcRenderer,
    // Have to manually redefine, otherwise Electron nukes this since main->renderer comms is not a standard use case
    on(channel, listener) {
      return ipcRenderer.on(channel, listener);
    },
  },
});
