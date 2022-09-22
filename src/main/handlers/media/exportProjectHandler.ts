import { IpcContext } from '../../types';
import { RuntimeProject, ExportFormat } from '../../../sharedTypes';
import { getExportFilePath } from '../helpers/exportUtils';
import { exportTo } from '../../export/exportTo';

type ExportProject = (
  exportFormat: ExportFormat,
  ipcContext: IpcContext,
  project: RuntimeProject
) => Promise<string>;

const exportProject: ExportProject = async (exportFormat, ipcContext, project) => {
  const { mainWindow } = ipcContext;

  const filePath = await getExportFilePath(exportFormat, mainWindow, project);

  await exportTo(exportFormat, filePath, mainWindow, project);

  return filePath;
};

export default exportProject;
