/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import os from 'os';
import { app } from 'electron';
import { OperatingSystems } from '../sharedTypes';

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

export const padZeros: (num: number, len: number) => string = (num, len) => {
  return String(num).padStart(len, '0');
};

export const integerDivide: (a: number, b: number) => number = (a, b) => {
  return Math.floor(a / b);
};

export const mkdir = (dirPath: string) => {
  if (!existsSync(dirPath)) {
    try {
      mkdirSync(dirPath);
    } catch (err) {
      console.error(err);
    }
  }
};

export const handleOSQuery: () => OperatingSystems | null = () => {
  const isDarwin = os.platform() === OperatingSystems.MACOS;
  const isWindows = os.platform() === OperatingSystems.WINDOWS;
  const isLinux = os.platform() === OperatingSystems.LINUX;

  if (isDarwin) {
    return OperatingSystems.MACOS;
  }
  if (isWindows) {
    return OperatingSystems.WINDOWS;
  }
  if (isLinux) {
    return OperatingSystems.LINUX;
  }

  return null;
};

export const appDataStoragePath: () => string = () =>
  path.join(app.getPath('userData'), 'mlvet');
