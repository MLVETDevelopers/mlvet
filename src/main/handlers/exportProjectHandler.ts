import { BrowserWindow, dialog } from 'electron';
import { Project } from '../../sharedTypes';
import { exportEDL } from '../export';

const getExportFilePath: (
  mainWindow: BrowserWindow | null
) => Promise<string> = async (mainWindow) => {
  if (mainWindow === null) {
    throw new Error('Main window not defined');
  }

  const dialogResponse = await dialog.showSaveDialog(mainWindow, {
    filters: [{ name: '.edl Files', extensions: ['edl'] }],
    buttonLabel: 'Export',
    title: 'Export Project',
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
  project.exportFilePath = filePath;

  exportEDL(mainWindow, project);
};

const handleExportProject: (
  mainWindow: BrowserWindow | null,
  project: Project
) => Promise<void> = async (mainWindow, project) => {
  const filePath = await getExportFilePath(mainWindow);

  await exportProjectToFile(filePath, mainWindow, project);
};

export default handleExportProject;
