/* eslint-disable no-plusplus */
import { BrowserWindow } from 'electron';
import * as promises from 'fs/promises';
import path, { join } from 'path';
import ffprobe from 'ffprobe';
import ffprobeStatic from 'ffprobe-static';
import { constants } from 'fs';
import { secondToEDLTimestamp, padZeros } from '../timeUtils';
import { RuntimeProject, Transcription } from '../../sharedTypes';
import { mkdir } from '../util';
import convertTranscriptToCuts from '../../transcriptProcessing/transcriptToCuts';
import { fracFpsToDec } from '../handlers/helpers/exportUtils';

export const constructEDL: (
  title: string,
  transcription: Transcription,
  source: string | null,
  mainWindow: BrowserWindow | null
) => Promise<string> = async (title, transcription, source, mainWindow) => {
  let fps = 30; // default to a safe 30fps.
  if (!source) throw Error('Video Source does not exist');
  try {
    await promises.access(source, constants.R_OK);
    const videoData = await ffprobe(source, { path: ffprobeStatic.path });
    fps = fracFpsToDec(videoData.streams[0].avg_frame_rate);
  } catch {
    throw Error('Video Source does not exist');
  }

  // this can be technically incorrect in some rare cases, but it doesn't affect functionality
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

      /**
       * Addressed the gap problem by rounding up 1 frame per cut, it will be overwritten in case there is no rounding error,
       * so this will only work to fill in microgaps. LMK if a less jank solution is wanted.
       */
      const editEnd = secondToEDLTimestamp(
        cut.startTime + cut.duration + 1 / fps,
        fps
      );

      timeline.start = timeline.end;
      timeline.end += cut.duration;

      const timelineStart = secondToEDLTimestamp(timeline.start, fps);
      const timelineEnd = secondToEDLTimestamp(timeline.end, fps);

      mainWindow?.webContents.send('export-progress-update', i / entries);

      return `${edlEntry}        ${editStart} ${editEnd} ${timelineStart} ${timelineEnd}\n* FROM CLIP NAME: ${source}\n\n`;
    }, timeline)
    .join('');
  return output;
};

export const exportEDL: (
  exportFilePath: string,
  mainWindow: BrowserWindow | null,
  project: RuntimeProject
) => Promise<void> = async (exportFilePath, mainWindow, project) => {
  const exportDir = path.dirname(exportFilePath);

  mkdir(exportDir);

  const exportFilename = path.basename(
    exportFilePath,
    path.extname(exportFilePath)
  );

  if (project.transcription) {
    const edl = await constructEDL(
      project.name,
      project.transcription,
      project.mediaFilePath,
      mainWindow
    );

    promises.writeFile(join(exportDir, `${exportFilename}.edl`), edl);
    mainWindow?.webContents.send(
      'finish-export',
      project,
      project.projectFilePath
    );
  }
};

export default exportEDL;
