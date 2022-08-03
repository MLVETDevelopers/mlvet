import { BrowserWindow, dialog } from 'electron';

type SaveChangesDialog = (
  mainWindow: BrowserWindow,
  projectFileName?: string
) => Promise<number>;

export const SAVE_SELECTED = 0;
export const DONT_SAVE_SELECTED = 1;
export const SAVE_CANCELLED = 2;

export const saveChangesDialog: SaveChangesDialog = async (
  mainWindow,
  projectFileName
) => {
  const result = await dialog.showMessageBox(mainWindow, {
    message: projectFileName
      ? `Do you want to save the changes you have made to ${projectFileName}?`
      : `Do you want to save your changes?`,
    detail: "Your changes will be lost if you don't save them",
    buttons: ['Save', `Don't Save`, 'Cancel'],
    type: 'warning',
    defaultId: 0,
  });

  return result.response as number;
};
