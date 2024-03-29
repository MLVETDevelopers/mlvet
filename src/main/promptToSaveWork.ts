import { BrowserWindow } from 'electron';
import path from 'path';
import AppState from './AppState';
import saveChangesDialog from './handlers/file/saveChangesDialog';
import { SaveDialogSelections } from './handlers/helpers/saveDialog';

/**
 * Prompts the user to save their work when they close the app
 * @returns whether the app can continue closing
 */
const promptToSaveWork: (
  mainWindow: BrowserWindow,
  appState: AppState,
  closeAfter?: boolean
) => boolean = (mainWindow, appState, closeAfter = true) => {
  if (!appState.getDocumentEdited()) {
    return true;
  }

  const fileName = path.basename(appState.getRepresentedFilePath() ?? '');

  const buttonIndex = saveChangesDialog(mainWindow, fileName);

  if (buttonIndex === SaveDialogSelections.SAVE_SELECTED) {
    // Save, and tell the app to close after it's saved
    mainWindow.webContents.send('initiate-save-project', closeAfter);

    // Don't continue the close operation right now, it will be re-initiated after the save is complete
    return false;
  }

  if (buttonIndex === SaveDialogSelections.DONT_SAVE_SELECTED) {
    // Don't save
    return true;
  }

  // Cancel
  return false;
};

export default promptToSaveWork;
