import { BrowserWindow, dialog } from 'electron';
import { writeFile } from 'fs/promises';
import { Project } from '../../../sharedTypes';
import { saveChangesDialog, SAVE_CANCELLED } from '../misc/saveChangesDialog';

export const getSaveFilePath: (
  mainWindow: BrowserWindow | null,
  proposedFileName: string
) => Promise<string> = async (mainWindow, proposedFileName) => {
  if (mainWindow === null) {
    throw new Error('Main window not defined');
  }

  const dialogResponse = await dialog.showSaveDialog(mainWindow, {
    filters: [{ name: 'MLVET Files', extensions: ['mlvet'] }],
    buttonLabel: 'Save',
    title: 'Save Project',
    properties: ['createDirectory'],
    defaultPath: proposedFileName,
  });

  if (dialogResponse.canceled) {
    throw new Error('Dialog cancelled');
  }

  return dialogResponse.filePath as string;
};

export const saveProjectToFile: (
  filePath: string,
  project: Project
) => Promise<void> = async (filePath, project) => {
  const projectAsString = JSON.stringify(project);

  await writeFile(filePath, projectAsString);
};

export const confirmSave: (
  mainWindow: BrowserWindow | null,
  proposedFileName: string
) => Promise<number> = async (mainWindow, proposedFileName) => {
  if (mainWindow === null) {
    throw new Error('Main window not defined');
  }

  const confirmSaveDialogResponse = await saveChangesDialog(
    mainWindow,
    proposedFileName
  );

  // if cancel button is selected
  if (confirmSaveDialogResponse === SAVE_CANCELLED) {
    throw new Error('Dialog cancelled');
  }

  return confirmSaveDialogResponse;
};
