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

export const fracToInt: (fracFps: string) => number = (fracFps) => {
  /**
   * Converts a string of the forma "a/b" for integers a,b
   * and outputs the rounded value, evaluating it as a fraction
   * e.g. "5997/100" -> 60
   *
   */
  const [numerator, denominator] = fracFps.split('/').map(Number); // get the numbers (separated by / ), and convert to numbers.
  return Math.round(numerator / denominator);
};
