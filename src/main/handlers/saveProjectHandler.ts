import { writeFile } from 'fs/promises';
import { BrowserWindow, dialog } from 'electron';
import { Project } from '../../sharedTypes';

const extractFileName: (filePath: string) => string = (filePath) => {
  // TODO(patrick): support windows, which uses back slashes
  const split = filePath.split('/');
  return split[split.length - 1];
};

const getSaveFilePath: (
  mainWindow: BrowserWindow | null,
  proposedFileName: string
) => Promise<string> = async (mainWindow) => {
  if (mainWindow === null) {
    throw new Error('Main window not defined');
  }

  const dialogResponse = await dialog.showSaveDialog(mainWindow, {
    filters: [{ name: 'MLVET Files', extensions: ['mlvet'] }],
    buttonLabel: 'Save',
    title: 'Save Project',
    properties: ['createDirectory'],
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
    project.projectFilePath === null
      ? await getSaveFilePath(mainWindow)
      : project.projectFilePath;

  await saveProjectToFile(filePath, project);

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
