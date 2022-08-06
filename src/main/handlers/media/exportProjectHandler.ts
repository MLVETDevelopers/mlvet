import { IpcContext } from '../../types';
import { RuntimeProject } from '../../../sharedTypes';
import { getExportFilePath } from '../helpers/exportUtils';
import { exportEDL } from '../../export/export';

type ExportProject = (
  ipcContext: IpcContext,
  project: RuntimeProject
) => Promise<string>;

const exportProject: ExportProject = async (ipcContext, project) => {
  const { mainWindow } = ipcContext;

  const filePath = await getExportFilePath(mainWindow, project);

  exportEDL(filePath, mainWindow, project);

  return filePath;
};

export default exportProject;
