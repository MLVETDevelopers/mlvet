import path from 'path';
import os from 'os';
import fs from 'fs';
import { PLATFORMS, platformPaths } from './helpers';

export const getBaseDLLPath = () => {
  // Path is different in dev than in production
  const prodPath =
    process.env.NODE_ENV === 'development'
      ? '../../assets/voskDLLs'
      : '../../../assets/voskDLLs';

  return path.join(__dirname, prodPath, 'lib');
};

export const getDLLDir = () => {
  const baseDLLPath = getBaseDLLPath();

  let dllDir;
  if (os.platform() === PLATFORMS.WINDOWS) {
    dllDir = path.join(baseDLLPath, platformPaths.WINDOWS, 'libvosk.dll');
  } else if (os.platform() === PLATFORMS.MAC) {
    dllDir = path.join(baseDLLPath, platformPaths.MAC, 'libvosk.dylib');
  } else {
    dllDir = path.join(baseDLLPath, platformPaths.LINUX, 'libvosk.so');
  }

  if (!fs.existsSync(dllDir)) {
    throw new Error(`DLL could not be found at path '${dllDir}'`);
  }

  return dllDir;
};

export const appendPATHStr = (currentPATHStr: string, newPath: string) => {
  return newPath + path.delimiter + currentPATHStr;
};

export const updatePathWithDLLs = (dllFilePath: string) => {
  let currentPath = process.env.Path as string;

  const dllDirectory = path.dirname(dllFilePath);
  currentPath = appendPATHStr(currentPath, path.join(dllDirectory));

  process.env.Path = currentPath;
};
