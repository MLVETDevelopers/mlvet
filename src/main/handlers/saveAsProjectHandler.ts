import {
  extractFileName,
  getSaveFilePath,
  saveProjectToFile,
} from './helpers/saveUtils';
import { Project } from '../../sharedTypes';
import { IpcContext } from '../types';

type HandleSaveAsProject = (
  ipcContext: IpcContext,
  project: Project
) => Promise<string>;

const handleSaveAsProject: HandleSaveAsProject = async (
  ipcContext,
  project
) => {
  const { mainWindow } = ipcContext;

  if (project.projectFilePath === null) {
    throw new Error('Cannot "save as" on a file without an existing file path');
  }

  const proposedFileName = `Copy of ${extractFileName(
    project.projectFilePath
  )}`;

  const filePath = await getSaveFilePath(mainWindow, proposedFileName);

  await saveProjectToFile(filePath, project);

  return filePath;
};

export default handleSaveAsProject;
