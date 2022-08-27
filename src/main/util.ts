/* eslint import/no-mutable-exports: off */

import { URL } from 'url';
import path from 'path';
import { existsSync, mkdirSync, statSync } from 'fs';
import { app } from 'electron';

export const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export let resolveHtmlPath: (htmlFileName: string) => string;

if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export const mkdir = (dirPath: string) => {
  if (!existsSync(dirPath)) {
    try {
      mkdirSync(dirPath);
    } catch (err) {
      console.error(err);
    }
  }
};

export const appDataStoragePath: () => string = () =>
  path.join(app.getPath('userData'), 'mlvet');

// Round a number in seconds to milliseconds - solves a lot of floating point errors
export const roundToMs: (input: number) => number = (input) =>
  Math.round(input * 1000) / 1000;

export const getRecentProjectsPath: () => string = () =>
  path.join(appDataStoragePath(), 'recentProjects.json');

export const getProjectDataDir: (projectId: string) => string = (projectId) =>
  path.join(appDataStoragePath(), projectId);

// TODO(chloe): when we support multiple media files, name each according to their ID
export const getAudioExtractPath: (projectId: string) => string = (projectId) =>
  path.join(getProjectDataDir(projectId), 'extractedAudio.mp3');

// TODO(chloe): when we support multiple media files, name each according to their ID
export const getThumbnailPath: (projectId: string) => string = (projectId) =>
  path.join(getProjectDataDir(projectId), 'thumbnail.png');

export const fileOrDirExists: (filePath: string) => boolean = (filePath) =>
  statSync(filePath, { throwIfNoEntry: false }) !== undefined;
