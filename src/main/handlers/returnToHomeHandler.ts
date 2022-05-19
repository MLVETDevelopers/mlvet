import { IpcContext } from '../types';
import { Project } from '../../sharedTypes';
import { confirmSave } from './helpers/saveUtils';

type ReturnToHome = (
  ipcContext: IpcContext,
  project: Project
) => Promise<number>;

const PROJECT_ALREADY_SAVED = -1;

const returnToHome: ReturnToHome = async (ipcContext, project) => {
  const { mainWindow } = ipcContext;

  // Checking if project has a save file
  // TODO: Check if any changes have been made since last save ('dirty feature')
  const filePath = project.projectFilePath;

  if (!filePath) {
    const userResponse = await confirmSave(mainWindow, project.name);
    return userResponse;
  }

  return PROJECT_ALREADY_SAVED;
};

export default returnToHome;
