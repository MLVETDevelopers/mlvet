/* eslint-disable no-plusplus */
import { BrowserWindow } from 'electron';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { Project, Transcription } from '../sharedTypes';
import { padZeros, integerDivide, mkdir } from './util';

// 00:00:00:00
const secondToTimestamp: (num: number) => string = (num) => {
  return [3600, 60, 1, 0.01]
    .map((mult) => padZeros(integerDivide(num, mult), 2))
    .join(':');
};

const constructEDL: (
  title: string,
  transcription: Transcription,
  source: string | null,
  mainWindow: BrowserWindow | null
) => string = (title, transcription, source, mainWindow) => {
  let output = `TITLE: ${title}\nFCM: NON-DROP FRAME\n\n`;
  const { words } = transcription;
  const entries = words.length;
  output += words
    .map((word, i) => {
      const edlEntry = `${padZeros(
        i + 1,
        Math.floor(Math.log10(entries)) + 1
      )}\tAX\tAA/V\tC`;

      const editStart = secondToTimestamp(word.startTime);
      const editEnd = secondToTimestamp(word.startTime + word.duration);

      mainWindow?.webContents.send('export-progress-update', i / entries);

      return `${edlEntry}\t${editStart}\t${editEnd}\n* FROM CLIP NAME: ${
        source ?? 'FILE PATH NOT FOUND'
      }\n\n`;
    })
    .join('');

  return output;
};

export const exportEDL: (
  mainWindow: BrowserWindow | null,
  project: Project
) => void = (mainWindow, project) => {
  if (project.exportFilePath === null) {
    console.log('export edl returned null');
    console.log(project);
    return;
  }

  console.log('export edl called');
  console.log(project);

  mkdir(project.exportFilePath);

  if (project.transcription) {
    writeFileSync(
      join(project.exportFilePath, `${project.name}.edl`),
      constructEDL(
        project.name,
        project.transcription,
        project.mediaFilePath,
        mainWindow
      )
    );
    mainWindow?.webContents.send('finish-export', 1);
  }
};

export default exportEDL;
