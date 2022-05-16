import { readFile } from 'fs/promises';
import { BrowserWindow, dialog } from 'electron';
import { Project } from '../../sharedTypes';
import { CURRENT_SCHEMA_VERSION } from '../../constants';
import { IpcContext } from '../types';

const getOpenFilePath: (
  mainWindow: BrowserWindow | null
) => Promise<string> = async (mainWindow) => {
  if (mainWindow === null) {
    throw new Error('Main window not defined');
  }

  const dialogResponse = await dialog.showOpenDialog(mainWindow, {
    filters: [{ name: 'MLVET Files', extensions: ['mlvet'] }],
    buttonLabel: 'Open',
    title: 'Open Project',
    properties: ['createDirectory', 'openFile'],
  });

  if (dialogResponse.canceled || dialogResponse.filePaths.length === 0) {
    throw new Error('Dialog cancelled');
  }

  const filePath = dialogResponse.filePaths[0] as string;

  return filePath;
};

const openProjectFromFile: (filePath: string) => Promise<Project> = async (
  filePath
) => {
  const projectAsBuffer = await readFile(filePath);

  try {
    const projectAsString = projectAsBuffer.toString();
    const project = JSON.parse(projectAsString);

    if (project.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      throw new Error('Schema version does not match current version');
    }

    return project;
  } catch (err) {
    throw new Error(`Error reading project file: ${err}`);
  }
};

type HandleOpenProject = (
  ipcContext: IpcContext,
  filePath: string | null
) => Promise<{ project: Project; filePath: string }>;

const handleOpenProject: HandleOpenProject = async (ipcContext, filePath) => {
  const { mainWindow } = ipcContext;

  const openFilePath =
    filePath === null ? await getOpenFilePath(mainWindow) : filePath;

  const project = await openProjectFromFile(openFilePath);

  return { project, filePath: openFilePath };
};

export default handleOpenProject;
