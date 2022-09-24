/* eslint-disable import/prefer-default-export */

import { BrowserWindow, dialog } from 'electron';
import path from 'path';
import { RuntimeProject, ExportFormat } from '../../../sharedTypes';

export const getExportFilePath: (
  exportFormat: ExportFormat,
  mainWindow: BrowserWindow | null,
  project: RuntimeProject
) => Promise<string> = async (exportFormat, mainWindow, project) => {
  if (mainWindow === null) {
    throw new Error('Main window not defined');
  }

  if (project.projectFilePath == null) {
    throw new Error('Project file path not defined');
  }

  const defaultName = path.basename(
    project.projectFilePath,
    path.extname(project.projectFilePath)
  );

  const dialogResponse = await dialog.showSaveDialog(mainWindow, {
    defaultPath: defaultName,
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
