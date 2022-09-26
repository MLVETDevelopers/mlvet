import path from 'path';
import os from 'os';
import fs from 'fs';
import { OperatingSystems } from '../sharedTypes';
import { operatingSystemDllFilePaths } from './helpers';

/**
 * Returns the path to the vosk DLL library for all OS's
 */
export const getBaseDllPath = () => {
  // Path is different in dev than in production
  const dllPath =
    process.env.NODE_ENV === 'development'
      ? '../../assets/voskDLLs'
      : '../../../assets/voskDLLs';

  return path.join(__dirname, dllPath, 'lib');
};

/**
 * Returns the path to the vosk DLL file for the current OS
 */
export const getDllDir = () => {
  const baseDllPath = getBaseDllPath();

  const dllFilePath =
    operatingSystemDllFilePaths[os.platform() as OperatingSystems];
  const dllDir = path.join(baseDllPath, dllFilePath);

  if (!fs.existsSync(dllDir)) {
    throw new Error(`DLL could not be found at path '${dllDir}'`);
  }

  return dllDir;
};

/**
 * Utility function for adding new paths/strings to the windows PATH environment variable
 */
export const appendPathStr = (currentPathStr: string, newPath: string) => {
  return newPath + path.delimiter + currentPathStr;
};

/**
 * Adds the path to the vosk DLL file to the windows PATH environment variable
 * Note: new paths take precedence over old paths
 */
export const updatePathWithDlls = (dllFilePath: string) => {
  let currentPath = process.env.PATH as string;

  const dllDirectory = path.dirname(dllFilePath);
  currentPath = appendPathStr(currentPath, path.join(dllDirectory));

  process.env.PATH = currentPath;
};
