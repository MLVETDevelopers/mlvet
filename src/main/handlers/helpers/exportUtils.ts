/* eslint-disable import/prefer-default-export */

import { BrowserWindow, dialog } from 'electron';
import { RuntimeProject } from '../../../sharedTypes';

export const getExportFilePath: (
  mainWindow: BrowserWindow | null,
  project: RuntimeProject
) => Promise<string> = async (mainWindow, project) => {
  if (mainWindow === null) {
    throw new Error('Main window not defined');
  }

  const dialogResponse = await dialog.showSaveDialog(mainWindow, {
    defaultPath: project.projectFilePath ?? undefined,
    filters: [{ name: '.edl Files', extensions: ['edl'] }],
    buttonLabel: 'Export',
    title: 'Export Project',
    properties: ['createDirectory'],
  });

  if (dialogResponse.canceled) {
    throw new Error('Dialog cancelled');
  }

  return dialogResponse.filePath as string;
};

export const fracFpsToDec: (fracFps: string) => number = (fracFps) => {
  const nums = fracFps.split('/').map(Number); // get the numbers (separated by / ), and convert to numbers.
  return nums[0] / nums[1];
};
