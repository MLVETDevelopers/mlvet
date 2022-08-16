import path from 'path';
import { IpcContext } from '../../types';
import { RuntimeProject } from '../../../sharedTypes';
import { confirmSave } from '../helpers/saveUtils';

type ReturnToHome = (
  ipcContext: IpcContext,
  project: RuntimeProject
) => Promise<number>;

const PROJECT_ALREADY_SAVED = -1;

const returnToHome: ReturnToHome = async (ipcContext, project) => {
  const { mainWindow } = ipcContext;

  const fileName = path.basename(project.projectFilePath ?? '');

  if (project.isEdited) {
    const userResponse = await confirmSave(mainWindow, fileName);
    return userResponse;
  }
  return PROJECT_ALREADY_SAVED;
};

export default returnToHome;
