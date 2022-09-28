import { BrowserWindow, dialog } from 'electron';
import { SaveDialogSelections } from '../helpers/saveDialog';

type SaveChangesDialog = (
  mainWindow: BrowserWindow,
  projectFileName?: string
) => SaveDialogSelections;

const saveChangesDialog: SaveChangesDialog = (mainWindow, projectFileName) => {
  const result = dialog.showMessageBoxSync(mainWindow, {
    message: projectFileName
      ? `Do you want to save the changes you have made to ${projectFileName}?`
      : `Do you want to save your changes?`,
    detail: "Your changes will be lost if you don't save them",
    buttons: ['Save', `Don't Save`, 'Cancel'],
    type: 'warning',
    defaultId: 0,
  });

  return result;
};

export default saveChangesDialog;
