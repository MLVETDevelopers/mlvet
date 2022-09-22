/* eslint-disable no-plusplus */
import { BrowserWindow } from 'electron';
import { access, writeFile } from 'fs/promises';
import path, { join } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { constants } from 'fs';
import { ffprobePath } from '../ffUtils';
import { secondToEdlTimestamp, padZeros } from '../timeUtils';
import { RuntimeProject, Transcription } from '../../sharedTypes';
import { mkdir } from '../util';
import convertTranscriptToCuts from '../../transcriptProcessing/transcriptToCuts';
import { fracToInt } from '../handlers/helpers/exportUtils';

export const getFps: (source: string) => Promise<number> = (source: string) => {
  ffmpeg.setFfprobePath(ffprobePath);
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(source, (err, data) => {
      if (data.streams[0].r_frame_rate)
        resolve(fracToInt(data.streams[0].r_frame_rate));
      reject(err);
    });
  });
};

export const constructEDL: (
  title: string,
  transcription: Transcription,
  source: string | null,
  mainWindow: BrowserWindow | null
) => Promise<string> = async (title, transcription, source, mainWindow) => {
  let fps = 30; // default to a safe 30fps.
  if (!source) throw Error('Video Source does not exist');
  try {
    await access(source, constants.R_OK);
    fps = await getFps(source);
  } catch {
    console.log(`Video Source path:\n${source} \nis not valid`); // Temporarily here before tests mock ffprobe.
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

      const editStart = secondToEdlTimestamp(cut.startTime, fps);

      const editEnd = secondToEdlTimestamp(
        cut.startTime + cut.duration + 1 / fps,
        fps
      );

      timeline.start = timeline.end;
      timeline.end += cut.duration;

      const timelineStart = secondToEdlTimestamp(timeline.start, fps);
      const timelineEnd = secondToEdlTimestamp(timeline.end, fps);

      mainWindow?.webContents.send('export-progress-update', i / entries);

      return `${edlEntry}        ${editStart} ${editEnd} ${timelineStart} ${timelineEnd}\n* FROM CLIP NAME: ${source}\n\n`;
    }, timeline)
    .join('');
  return output;
};

export const exportToEDL: (
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

    writeFile(join(exportDir, `${exportFilename}.edl`), edl);
  }
};

export default exportToEDL;
