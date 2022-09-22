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
  if (exportFormat === ExportFormat.EDL) {
    exportToEDL(exportFilePath, mainWindow, project);
  } else if (exportFormat === ExportFormat.MP4) {
    exportToMp4(exportFilePath, mainWindow, project);
  }
};

export default exportTo;
