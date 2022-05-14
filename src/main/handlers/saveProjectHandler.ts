import { BrowserWindow, dialog } from 'electron';
import { writeFile } from 'fs/promises';
import path from 'path';
import { Project } from '../../sharedTypes';

const extractFileName: (filePath: string) => string = (filePath) => {
  const split = filePath.split(path.delimiter);
  return split[split.length - 1];
};

const getSaveFilePath: (
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

const saveProjectToFile: (
  filePath: string,
  project: Project
) => Promise<void> = async (filePath, project) => {
  const projectAsString = JSON.stringify(project);

  await writeFile(filePath, projectAsString);
};

export const handleSaveProject: (
  mainWindow: BrowserWindow | null,
  project: Project
) => Promise<string> = async (mainWindow, project) => {
  const filePath =
    project.projectFilePath ??
    (await getSaveFilePath(mainWindow, project.name));

  await saveProjectToFile(filePath, { ...project, projectFilePath: filePath });

  return filePath;
};

export const handleSaveAsProject: (
  mainWindow: BrowserWindow | null,
  project: Project
) => Promise<string> = async (mainWindow, project) => {
  if (project.projectFilePath === null) {
    throw new Error('Cannot "save as" on a file without an existing file path');
  }

  const proposedFileName = `Copy of ${extractFileName(
    project.projectFilePath
  )}`;

  const filePath = await getSaveFilePath(mainWindow, proposedFileName);

  await saveProjectToFile(filePath, project);

  return filePath;
};
