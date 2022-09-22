/* eslint-disable import/prefer-default-export */

import { BrowserWindow, dialog } from 'electron';
import { RuntimeProject, ExportFormat } from '../../../sharedTypes';

export const getExportFilePath: (
  exportFormat: ExportFormat,
  mainWindow: BrowserWindow | null,
  project: RuntimeProject
) => Promise<string> = async (exportFormat, mainWindow, project) => {
  if (mainWindow === null) {
    throw new Error('Main window not defined');
  }

  const dialogResponse = await dialog.showSaveDialog(mainWindow, {
    defaultPath: project.projectFilePath ?? undefined,
    filters: [{ name: `.${exportFormat} Files`, extensions: [exportFormat] }],
    buttonLabel: 'Export',
    title: 'Export Project',
    properties: ['createDirectory'],
  });

  if (dialogResponse.canceled) {
    throw new Error('Dialog cancelled');
  }

  return dialogResponse.filePath as string;
};

export const fracToInt: (fracFps: string) => number = (fracFps) => {
  const [numerator, denominator] = fracFps.split('/').map(Number); // get the numbers (separated by / ), and convert to numbers.
  return Math.round(numerator / denominator);
};
