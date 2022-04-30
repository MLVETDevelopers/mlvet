/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

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

export const padZeros = (num: number, len: number) => {
  return String(num).padStart(len, '0');
};

export const integerDivide = (a: number, b: number) => {
  return Math.floor(a / b);
};

export const writeFile = (filePath: string, data: any) => {
  try {
    writeFileSync(filePath, data, { flag: 'w' });
  } catch (err) {
    console.error(err);
  }
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
