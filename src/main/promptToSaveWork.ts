import { BrowserWindow } from 'electron';
import path from 'path';
import AppState from './AppState';
import {
  saveChangesDialog,
  SaveDialogSelections,
} from './handlers/file/saveChangesDialog';

/**
 * Prompts the user to save their work when they close the app
 * @returns whether the app can continue closing
 */
const promptToSaveWork: (
  mainWindow: BrowserWindow,
  appState: AppState
) => boolean = (mainWindow, appState) => {
  if (!appState.getDocumentEdited()) {
    return true;
  }

  const fileName = path.basename(appState.getRepresentedFilePath() ?? '');

  const buttonIndex = saveChangesDialog(mainWindow, fileName);

  if (buttonIndex === SaveDialogSelections.SAVE_SELECTED) {
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
