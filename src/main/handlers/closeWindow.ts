import { IpcContext } from '../types';

type CloseWindow = (ipcContext: IpcContext) => void;

const closeWindow: CloseWindow = (ipcContext) => {
  const { mainWindow } = ipcContext;

  mainWindow.close();
};

export default closeWindow;
