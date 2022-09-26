/* eslint-disable no-plusplus */
import { BrowserWindow } from 'electron';
import { RuntimeProject, ExportFormat } from '../../sharedTypes';
import { exportToEDL } from './exportToEDL';
import { exportToMp4 } from './exportToMP4';

export const exportTo: (
  exportFormat: ExportFormat,
  exportFilePath: string,
  mainWindow: BrowserWindow | null,
  project: RuntimeProject
) => Promise<void> = async (
  exportFormat,
  exportFilePath,
  mainWindow,
  project
) => {
  mainWindow?.webContents.send(
    'export-start',
    project.id,
    project.projectFilePath
  );

  if (exportFormat === ExportFormat.EDL) {
    await exportToEDL(exportFilePath, mainWindow, project);
  } else if (exportFormat === ExportFormat.MP4) {
    await exportToMp4(exportFilePath, mainWindow, project);
  }

  mainWindow?.webContents.send('export-finish', project, exportFilePath);
};

export default exportTo;
