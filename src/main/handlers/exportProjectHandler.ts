import { writeFile } from 'fs/promises';
import { BrowserWindow, dialog } from 'electron';
import path from 'path';
import { Project } from '../../sharedTypes';
import { exportEDL } from '../export';

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

const exportProjectToFile: (
  filePath: string,
  mainWindow: BrowserWindow | null,
  project: Project
) => Promise<void> = async (filePath, mainWindow, project) => {
  console.log('export project to file called');
  console.log(project);

  project.exportFilePath = path.dirname(filePath);
  exportEDL(mainWindow, project);
};

const handleExportProject: (
  mainWindow: BrowserWindow | null,
  project: Project
) => Promise<void> = async (mainWindow, project) => {
  const filePath = await getSaveFilePath(mainWindow);
  console.log('handle export project called');
  console.log(project);

  await exportProjectToFile(filePath, mainWindow, project);
};

export default handleExportProject;
