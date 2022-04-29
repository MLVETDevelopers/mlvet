/* eslint-disable no-plusplus */
import path from 'path';
import { padZeros, integerDivide, writeFile, mkdir } from './utils';

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
    console.log(e);
  }
  return output;
};

export const exportEDL = (project: ProjectBase) => {
  mkdir(project.savePath);

  if (project.transcription) {
    writeFile(
      path.join(project.savePath, `${project.name}.edl`),
      constructEDL(project.name, project.transcription)
    );
  }
};

const exportFuncs = {
  exportEDL,
};
export default exportFuncs;

// Mock type, delete after merge
type Transcription = { words: [Word] };

type Word = {
  text: string;
  start_time: number;
  duration: number;
};

interface ProjectBase {
  schemaVersion: number;
  name: string;
  filePath: string;
  savePath: string;
  transcription: Transcription | null;
}
