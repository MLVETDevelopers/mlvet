const { ipcRenderer } = window.electron;

const requestMediaDialog: () => Promise<string | null> = () =>
  ipcRenderer.invoke('import-media');

export default requestMediaDialog;
