import { IpcContext } from '../../types';
import { RuntimeProject } from '../../../sharedTypes';
import { getSaveFilePath, saveProjectToFile } from '../helpers/saveUtils';

type SaveProject = (
  ipcContext: IpcContext,
  project: RuntimeProject
) => Promise<string>;

const saveProject: SaveProject = async (ipcContext, project) => {
  const { mainWindow } = ipcContext;

  const filePath =
    project.projectFilePath ??
    (await getSaveFilePath(mainWindow, project.name));

  await saveProjectToFile(filePath, { ...project, projectFilePath: filePath });

  return filePath;
};

export default saveProject;
