import { IpcContext } from '../types';
import { Project } from '../../sharedTypes';
import { getExportFilePath, exportProjectToFile } from './helpers/exportUtils';

type ExportProject = (
  ipcContext: IpcContext,
  project: Project
) => Promise<string>;

const exportProject: ExportProject = async (ipcContext, project) => {
  const { mainWindow } = ipcContext;

  const filePath = await getExportFilePath(mainWindow, project);

  await exportProjectToFile(filePath, mainWindow, project);

  return filePath;
};

export default exportProject;
