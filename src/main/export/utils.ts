import { existsSync, mkdirSync, writeFileSync } from 'fs';

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
    console.log(err);
  }
};

export const mkdir = (path: string) => {
  if (!existsSync(path)) {
    try {
      mkdirSync(path);
    } catch (err) {
      console.log(err);
    }
  }
};
