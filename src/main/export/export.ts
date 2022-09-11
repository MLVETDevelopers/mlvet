/* eslint-disable no-plusplus */
import { BrowserWindow } from 'electron';
import { writeFileSync } from 'fs';
import path, { join } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { secondToEDLTimestamp, padZeros } from '../timeUtils';
import { RuntimeProject, Transcription } from '../../sharedTypes';
import { mkdir } from '../util';
import convertTranscriptToCuts from '../../transcriptProcessing/transcriptToCuts';

export const constructEDL: (
  title: string,
  transcription: Transcription,
  source: string | null,
  mainWindow: BrowserWindow | null
) => string = (title, transcription, source, mainWindow) => {
  if (!source) {
    throw Error('No Video Source');
  } else {
    let fps = 30;

    // get fps
    ffmpeg(source).on('codecData', (data) => {
      const fpsString = data.video_details[6];
      fps = <number>fpsString.substring(0, fpsString.length - 4);
      console.log(fpsString, fps);
    });
    console.log(fps);

    let output = `TITLE: ${title}\nFCM: NON-DROP FRAME\n\n`;

    const cuts = convertTranscriptToCuts(transcription);
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

        const editStart = secondToEDLTimestamp(cut.startTime, fps);
        const editEnd = secondToEDLTimestamp(cut.startTime + cut.duration, fps);

        timeline.start = timeline.end;
        timeline.end = timeline.start + cut.duration;

        const timelineStart = secondToEDLTimestamp(timeline.start, fps);
        const timelineEnd = secondToEDLTimestamp(timeline.end, fps);

        mainWindow?.webContents.send('export-progress-update', i / entries);

        return `${edlEntry}        ${editStart} ${editEnd} ${timelineStart} ${timelineEnd}\n* FROM CLIP NAME: ${source}\n\n`;
      }, timeline)
      .join('');

    return output;
  }
};

export const exportEDL: (
  exportFilePath: string,
  mainWindow: BrowserWindow | null,
  project: RuntimeProject
) => void = (exportFilePath, mainWindow, project) => {
  const exportDir = path.dirname(exportFilePath);

  mkdir(exportDir);

  const exportFilename = path.basename(
    exportFilePath,
    path.extname(exportFilePath)
  );

  if (project.transcription) {
    writeFileSync(
      join(exportDir, `${exportFilename}.edl`),
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
