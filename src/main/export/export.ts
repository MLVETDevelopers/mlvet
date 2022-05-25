/* eslint-disable no-plusplus */
import { BrowserWindow } from 'electron';
import { writeFileSync } from 'fs';
import path, { join } from 'path';
import { secondToTimestamp, padZeros } from '../timeUtils';
import { Project, Transcription, Cut } from '../../sharedTypes';
import { mkdir } from '../util';
import convertTranscriptToCuts from '../processing/transcriptToCuts';

export const constructEDL: (
  title: string,
  transcription: Transcription,
  source: string | null,
  mainWindow: BrowserWindow | null
) => string = (title, transcription, source, mainWindow) => {
  let output = `TITLE: ${title}\nFCM: NON-DROP FRAME\n\n`;

  const cuts: Array<Cut> = convertTranscriptToCuts(transcription);
  const entries = cuts.length;
  const timeline = {
    start: 0,
    end: 0,
  };

  output += cuts
    .map((cut, i) => {
      const edlEntry = `${padZeros(
        i + 1,
        Math.max(Math.floor(Math.log10(entries)) + 1, 3)
      )}  AX       AA/V  C`;

      const editStart = secondToTimestamp(cut.startTime);
      const editEnd = secondToTimestamp(cut.startTime + cut.duration);

      timeline.start = timeline.end;
      timeline.end = timeline.start + cut.duration;

      const timelineStart = secondToTimestamp(timeline.start);
      const timelineEnd = secondToTimestamp(timeline.end);

      mainWindow?.webContents.send('export-progress-update', i / entries);

      return `${edlEntry}        ${editStart} ${editEnd} ${timelineStart} ${timelineEnd}\n* FROM CLIP NAME: ${
        source ?? 'FILE PATH NOT FOUND'
      }\n\n`;
    }, timeline)
    .join('');

  return output;
};

export const exportEDL: (
  mainWindow: BrowserWindow | null,
  project: Project
) => void = (mainWindow, project) => {
  if (project.exportFilePath === null) {
    return;
  }

  const exportFilepath = path.dirname(project.exportFilePath);
  mkdir(exportFilepath);
  const exportFilename = path.basename(
    project.exportFilePath,
    path.extname(project.exportFilePath)
  );

  if (project.transcription) {
    writeFileSync(
      join(exportFilepath, `${exportFilename}.edl`),
      constructEDL(
        project.name,
        project.transcription,
        project.mediaFilePath,
        mainWindow
      )
    );
    mainWindow?.webContents.send(
      'finish-export',
      project,
      project.projectFilePath
    );
  }
};

export default exportEDL;
