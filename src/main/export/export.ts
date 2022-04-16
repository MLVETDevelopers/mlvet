/* eslint-disable no-plusplus */
import { writeFileSync } from 'fs';
import path from 'path';
import { homedir } from 'os';

const padZeros = (num: number, len: number) => {
  return String(num).padStart(len, '0');
};

const integerDivide = (a: number, b: number) => {
  return Math.floor(a / b);
};

const secondToTimestamp = (num: number) => {
  return `${padZeros(integerDivide(num, 3600), 2)}:${padZeros(
    integerDivide(num, 60),
    2
  )}:${padZeros(integerDivide(num, 1), 2)}:${padZeros(
    integerDivide(num, 0.01),
    2
  )}`;
};

const constructEDL = (title: string, data: any) => {
  let output = `TITLE: ${title}\nFCM: NON-DROP FRAME\n\n`;
  try {
    const { words } = data.transcripts[0];
    const entries = words.length;
    for (let i = 0; i < entries; i++) {
      const edlEntry = `${padZeros(i + 1, entries)}\tAX\tAA/V\tC`;

      const currWord = words[i];
      const editStart = secondToTimestamp(currWord.start_time);
      const editEnd = secondToTimestamp(
        currWord.start_time + currWord.duration
      );

      output += `${edlEntry}\t${editStart}\t${editEnd}\n* FROM CLIP NAME: sample\n\n`;
    }
  } catch (e) {
    console.log(e);
  }
  return output;
};

const writeFile = (filename: string, data: any) => {
  writeFileSync(filename, data, { flag: 'w' });
};

export const exportEDL = (
  savedir: string,
  filename: string,
  title: string,
  data: any
) => {
  const savepath = savedir || path.join(homedir(), 'Desktop');
  writeFile(path.join(savepath, `${filename}.edl`), constructEDL(title, data));
};

const exportFuncs = {
  exportEDL,
};
export default exportFuncs;

// test commit
