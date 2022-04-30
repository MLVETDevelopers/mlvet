/* eslint-disable no-plusplus */
import { join } from 'path';
import { Project, Transcription } from '../sharedTypes';
import { padZeros, integerDivide, writeFile, mkdir } from './util';

const secondToTimestamp = (num: number) => {
  return `${padZeros(integerDivide(num, 3600), 2)}:
          ${padZeros(integerDivide(num, 60), 2)}:
          ${padZeros(integerDivide(num, 1), 2)}:
          ${padZeros(integerDivide(num, 0.01), 2)}`;
};

const constructEDL = (title: string, transcription: Transcription) => {
  let output = `TITLE: ${title}\nFCM: NON-DROP FRAME\n\n`;
  try {
    const { words } = transcription;
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
    console.error(e);
  }
  return output;
};

export const exportEDL = (project: Project) => {
  mkdir(project.savePath);

  if (project.transcription) {
    writeFile(
      join(project.savePath, `${project.name}.edl`),
      constructEDL(project.name, project.transcription)
    );
  }
};

const exportFuncs = {
  exportEDL,
};
export default exportFuncs;
