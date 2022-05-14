import { dialog } from 'electron';
import { IpcContext } from '../types';

type ShowImportMediaDialog = (ipcContext: IpcContext) => Promise<string | null>;

const showImportMediaDialog: ShowImportMediaDialog = async (ipcContext) => {
  const { mainWindow } = ipcContext;

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
