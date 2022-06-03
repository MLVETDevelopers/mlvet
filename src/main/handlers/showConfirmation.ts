import { dialog } from 'electron';
import { IpcContext } from '../types';

type ShowConfirmation = (
  ipcContext: IpcContext,
  message: string,
  detail: string
) => Promise<boolean>;

const showConfirmation: ShowConfirmation = async (
  ipcContext,
  message,
  detail
) => {
  const { mainWindow } = ipcContext;

  const result = await dialog.showMessageBox(mainWindow, {
    message,
    detail,
    buttons: ['OK', 'Cancel'],
  });

  if (result.response === 0) {
    return true;
  }
  return false;
};

export default showConfirmation;
