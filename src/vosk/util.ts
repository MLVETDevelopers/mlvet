import path from 'path';
import os from 'os';
import fs from 'fs';
import {
  LocalConfig,
  OperatingSystems,
  TranscriptionEngine,
} from '../sharedTypes';
import { operatingSystemDllFilePaths } from './helpers';
import getTranscriptionEngineConfig from '../main/handlers/file/transcriptionConfig/getEngineConfig';

type GetBaseDllPath = () => Promise<string>;

/**
 * Returns the path to the vosk DLL library for all OS's
 */
export const getBaseDllPath: GetBaseDllPath = async () => {
  const localConfig = (await getTranscriptionEngineConfig(
    TranscriptionEngine.VOSK
  )) as LocalConfig;

  if (localConfig.libsPath === null)
    throw new Error('Vosk libs path not configured');

  return path.resolve(localConfig.libsPath);
};

/**
 * Returns the path to the vosk DLL file for the current OS
 */
export const getDllDir = async () => {
  const baseDllPath = await getBaseDllPath();

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
