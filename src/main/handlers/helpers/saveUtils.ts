import { BrowserWindow, dialog } from 'electron';
import { writeFile } from 'fs/promises';
import { PersistedProject, RuntimeProject } from '../../../sharedTypes';

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
  project: RuntimeProject
) => Promise<void> = async (filePath, project) => {
  // Persisted versions of projects exclude things like the file name, as that
  // is implied by the file it is being saved to!
  const persistedProject: PersistedProject = {
    id: project.id,
    mediaFileExtension: project.mediaFileExtension,
    mediaFilePath: project.mediaFilePath,
    mediaType: project.mediaType,
    name: project.name,
    schemaVersion: project.schemaVersion,
    transcription: project.transcription,
  };

  const projectAsString = JSON.stringify(persistedProject);

  await writeFile(filePath, projectAsString);
};

export const confirmSave: (
  mainWindow: BrowserWindow | null,
  proposedFileName: string
) => Promise<number> = async (mainWindow, proposedFileName) => {
  if (mainWindow === null) {
    throw new Error('Main window not defined');
  }

  const cancelled = 2;

  const confirmSaveDialogResponse = await dialog.showMessageBox(mainWindow, {
    message: `Do you want to save the changes you have made to ${proposedFileName}?`,
    detail: "Your changes will be lost if you don't save them",
    buttons: ['Save', "Don't save", 'Cancel'],
    defaultId: 0,
  });

  // if cancel button is selected
  if (confirmSaveDialogResponse.response === cancelled) {
    throw new Error('Dialog cancelled');
  }

  return confirmSaveDialogResponse.response as number;
};
