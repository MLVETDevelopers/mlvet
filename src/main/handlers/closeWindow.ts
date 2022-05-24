import { app } from 'electron';
import { IpcContext } from '../types';

type CloseWindow = (ipcContext: IpcContext) => void;

const closeWindow: CloseWindow = (ipcContext) => {
  const { mainWindow } = ipcContext;

  mainWindow.close();

  // Since we only allow one window open for now, close the whole app when we shut the window
  app.exit();
};

export default closeWindow;
