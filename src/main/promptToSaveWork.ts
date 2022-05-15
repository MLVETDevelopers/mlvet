import { BrowserWindow, dialog } from 'electron';
import path from 'path';

/**
 * Prompts the user to save their work when they close the app
 * @returns whether the app can continue closing
 */
const promptToSaveWork: (mainWindow: BrowserWindow) => boolean = (
  mainWindow
) => {
  if (!mainWindow.isDocumentEdited()) {
    return true;
  }

  const fileName = path.basename(mainWindow.getRepresentedFilename());

  const buttonIndex = dialog.showMessageBoxSync(mainWindow, {
    message: `Do you want to save the changes you made to ${fileName}?`,
    detail: `Your changes will be lost if you don't save them.`,
    buttons: ['Save', `Don't Save`, 'Cancel'],
    type: 'warning',
  });

  if (buttonIndex === 0) {
    // Save, and tell the app to close after it's saved
    mainWindow.webContents.send('initiate-save-project', true);

    // Don't continue the close operation right now, it will be re-initiated after the save is complete
    return false;
  }

  if (buttonIndex === 1) {
    // Don't save
    return true;
  }

  // Cancel
  return false;
};

export default promptToSaveWork;
