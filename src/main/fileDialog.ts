import { BrowserWindow, dialog } from 'electron';

const showImportMediaDialog: (
  mainWindow: BrowserWindow | null
) => Promise<string | null> = async (mainWindow) => {
  if (mainWindow === null) {
    return Promise.resolve(null);
  }

  const dialogResponse = await dialog.showOpenDialog(mainWindow, {
    filters: [
      { name: 'Video Files', extensions: ['mp4'] },
      { name: 'Audio Files', extensions: ['mp3'] },
    ],
    buttonLabel: 'Import',
    title: 'Import Media',
    properties: ['openFile'],
  });

  if (dialogResponse.canceled || dialogResponse.filePaths.length === 0) {
    return null;
  }
  return dialogResponse.filePaths[0];
};

export default showImportMediaDialog;
