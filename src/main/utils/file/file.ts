import fs, { readFileSync } from 'fs';
import path from 'path';
import { fileOrDirExists } from '../../util';

type GetFilesParentDir = (
  baseDir: string,
  targetFiles: string[]
) => Promise<string | null>;

/*
 * Recursively iterates through the directory tree and returns the path to the
 * folder that contains all the target files/folders
 */
export const getFilesParentDir: GetFilesParentDir = async (
  baseDir,
  targetFiles
) => {
  const dirFiles = fs.readdirSync(baseDir);

  const areFilesInDir = targetFiles.every((file) => dirFiles.includes(file));

  if (areFilesInDir) return baseDir;

  // eslint-disable-next-line no-restricted-syntax
  for (const dirFile of dirFiles) {
    const res = path.resolve(baseDir, dirFile);
    const isDir = fs.lstatSync(res).isDirectory();

    if (isDir) {
      // eslint-disable-next-line no-await-in-loop
      const filesParentDir = await getFilesParentDir(res, targetFiles);
      if (filesParentDir !== null) return filesParentDir;
    }
  }

  return null;
};

type Rename = (oldPath: string, newPath: string) => void;

export const renameFileOrDir: Rename = (oldPath, newPath) => {
  fs.renameSync(path.resolve(oldPath), path.resolve(newPath));
};

export const readJsonFile = async (filePath: string) => {
  if (fileOrDirExists(filePath)) {
    const dataBuffer = readFileSync(filePath);
    try {
      const dataString = dataBuffer.toString();
      const data: object = JSON.parse(dataString);
      return data;
    } catch (err) {
      throw new Error(`Error reading file: ${err}`);
    }
  }
  throw new Error(`File does not exist at ${filePath}`);
};
