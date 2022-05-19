import { BrowserWindow, dialog } from 'electron';
import { writeFile } from 'fs/promises';
import path from 'path';
import { Project } from '../../../sharedTypes';

export const extractFileName: (filePath: string) => string = (filePath) => {
  const split = filePath.split(path.delimiter);
  return split[split.length - 1];
};

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

  const confirmSaveDialogResponse = await dialog.showMessageBox(mainWindow, {
    message: `Do you want to save the changes you have made to ${proposedFileName}?`,
    detail: "Your changes will be lost if you don't save them",
    buttons: ['Save', "Don't save", 'Cancel'],
    defaultId: 0,
  });

  if (confirmSaveDialogResponse.response === 2) {
    throw new Error('Dialog cancelled');
  }

  return confirmSaveDialogResponse.response as number;
};
