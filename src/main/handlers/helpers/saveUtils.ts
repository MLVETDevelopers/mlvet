import { BrowserWindow, dialog } from 'electron';
import { writeFile } from 'fs/promises';
import saveChangesDialog from '../file/saveChangesDialog';
import { PersistedProject, RuntimeProject } from '../../../sharedTypes';
import { SaveDialogSelections } from './saveDialog';

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

  const confirmSaveDialogResponse = saveChangesDialog(
    mainWindow,
    proposedFileName
  );

  // if cancel button is selected
  if (confirmSaveDialogResponse === SaveDialogSelections.SAVE_CANCELLED) {
    console.log('Dialog cancelled');
  }

  return confirmSaveDialogResponse;
};
