/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import { existsSync, mkdirSync } from 'fs';
import { app } from 'electron';

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

export const appDataStoragePath: () => string = () =>
  path.join(app.getPath('userData'), 'mlvet');
