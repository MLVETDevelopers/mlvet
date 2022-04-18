import { writeFile } from 'fs/promises';
import { BrowserWindow, dialog } from 'electron';
import { Project } from '../sharedTypes';

const getSaveFilePath: (
  mainWindow: BrowserWindow | null
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

const handleSaveProject: (
  mainWindow: BrowserWindow | null,
  project: Project
) => Promise<void> = async (mainWindow, project) => {
  const filePath = await getSaveFilePath(mainWindow);

  await saveProjectToFile(filePath, project);
};

export default handleSaveProject;
