import path from 'path';
import { getSaveFilePath, saveProjectToFile } from './helpers/saveUtils';
import { Project } from '../../sharedTypes';
import { IpcContext } from '../types';

type SaveAsProject = (
  ipcContext: IpcContext,
  project: Project
) => Promise<string>;

const saveAsProject: SaveAsProject = async (ipcContext, project) => {
  const { mainWindow } = ipcContext;

  if (project.projectFilePath === null) {
    throw new Error('Cannot "save as" on a file without an existing file path');
  }

  const proposedFileName = `Copy of ${path.basename(project.projectFilePath)}`;

  const filePath = await getSaveFilePath(mainWindow, proposedFileName);

  await saveProjectToFile(filePath, project);

  return filePath;
};

export default saveAsProject;
