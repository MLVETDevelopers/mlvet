import { BrowserWindow, dialog } from 'electron';
import { IpcContext } from 'main/types';
import { Project } from '../../sharedTypes';
import { exportEDL } from '../export';

const getExportFilePath: (
  mainWindow: BrowserWindow | null,
  project: Project
) => Promise<string> = async (mainWindow, project) => {
  if (mainWindow === null) {
    throw new Error('Main window not defined');
  }

  const dialogResponse = await dialog.showSaveDialog(mainWindow, {
    defaultPath: project.name,
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
  ipcContext: IpcContext,
  project: Project
) => Promise<string> = async (ipcContext, project) => {
  const { mainWindow } = ipcContext;

  const filePath = await getExportFilePath(mainWindow, project);

  await exportProjectToFile(filePath, mainWindow, project);

  return filePath;
};

export default handleExportProject;
