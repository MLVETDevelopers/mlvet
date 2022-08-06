import { readFile } from 'fs/promises';
import { BrowserWindow, dialog } from 'electron';
import { PersistedProject, RuntimeProject } from '../../../sharedTypes';
import { CURRENT_SCHEMA_VERSION } from '../../../constants';
import { IpcContext } from '../../types';

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

const openProjectFromFile: (
  filePath: string
) => Promise<RuntimeProject> = async (filePath) => {
  const projectAsBuffer = await readFile(filePath);

  try {
    const projectAsString = projectAsBuffer.toString();
    const project: PersistedProject = JSON.parse(projectAsString);

    if (project.schemaVersion !== CURRENT_SCHEMA_VERSION) {
      throw new Error('Schema version does not match current version');
    }

    return {
      ...project,
      isEdited: false,
      projectFilePath: filePath,
    };
  } catch (err) {
    throw new Error(`Error reading project file: ${err}`);
  }
};

type OpenProject = (
  ipcContext: IpcContext,
  filePath: string | null
) => Promise<{ project: RuntimeProject | null; filePath: string }>;

const openProject: OpenProject = async (ipcContext, filePath) => {
  const { mainWindow } = ipcContext;

  const openFilePath = filePath ?? (await getOpenFilePath(mainWindow));

  try {
    const project = await openProjectFromFile(openFilePath);

    return { project, filePath: openFilePath };
  } catch (err) {
    return { project: null, filePath: openFilePath }; // Failed to open project - e.g. doesn't exist
  }
};

export default openProject;
