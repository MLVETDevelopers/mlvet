import path from 'path';
import os from 'os';
import fs from 'fs';
import { OperatingSystems } from '../sharedTypes';
import { operatingSystemDllFilePaths } from './helpers';

/**
 * Returns the path to the vosk DLL library for all OS's
 */
export const getBaseDLLPath = () => {
  // Path is different in dev than in production
  const prodPath =
    process.env.NODE_ENV === 'development'
      ? '../../assets/voskDLLs'
      : '../../../assets/voskDLLs';

  return path.join(__dirname, prodPath, 'lib');
};

/**
 * Returns the path to the vosk DLL file for the current OS
 */
export const getDLLDir = () => {
  const baseDLLPath = getBaseDLLPath();

  const dllFilePath =
    operatingSystemDllFilePaths[os.platform() as OperatingSystems];
  const dllDir = path.join(baseDLLPath, dllFilePath);

  if (!fs.existsSync(dllDir)) {
    throw new Error(`DLL could not be found at path '${dllDir}'`);
  }

  return dllDir;
};

/**
 * Utility function for adding new paths/strings to the windows PATH environment variable
 */
export const appendPATHStr = (currentPATHStr: string, newPath: string) => {
  return newPath + path.delimiter + currentPATHStr;
};

/**
 * Adds the path to the vosk DLL file to the windows PATH environment variable
 * Note: new paths take precedence over old paths
 */
export const updatePathWithDLLs = (dllFilePath: string) => {
  let currentPath = process.env.Path as string;

  const dllDirectory = path.dirname(dllFilePath);
  currentPath = appendPATHStr(currentPath, path.join(dllDirectory));

  process.env.Path = currentPath;
};
