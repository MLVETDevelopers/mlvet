import { IpcContext } from '../../types';
import { Project } from '../../../sharedTypes';
import { confirmSave } from '../helpers/saveUtils';

type ReturnToHome = (
  ipcContext: IpcContext,
  project: Project
) => Promise<number>;

const PROJECT_ALREADY_SAVED = -1;

const returnToHome: ReturnToHome = async (ipcContext, project) => {
  const { mainWindow } = ipcContext;

  if (project.isEdited) {
    const userResponse = await confirmSave(mainWindow, project.name);
    return userResponse;
  }
  return PROJECT_ALREADY_SAVED;
};

export default returnToHome;
