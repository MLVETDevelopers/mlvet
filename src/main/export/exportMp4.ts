/* eslint-disable no-plusplus */
import { BrowserWindow } from 'electron';
import path, { join } from 'path';
import ffmpeg, { FfmpegCommand } from 'fluent-ffmpeg';
import { RuntimeProject, Transcription } from '../../sharedTypes';
import { mkdir } from '../util';
import convertTranscriptToCuts from '../../transcriptProcessing/transcriptToCuts';
import { ffmpegPath } from '../ffUtils';

ffmpeg.setFfmpegPath(ffmpegPath);

export const exportMp4 = (
  title: string,
  transcription: Transcription,
  source: string | null,
  mainWindow: BrowserWindow | null
) => {
  const cuts = convertTranscriptToCuts(transcription);
  const entries = cuts.length;

  const timeline = {
    start: 0,
    end: 0,
  };
};

type ExportMp4 = (project: RuntimeProject) => Promise<string>;

const runFfmpeg: (command: FfmpegCommand) => Promise<string> = (command) => {
  return new Promise((resolve, reject) => {
    command.on('error', (stdout: string, stderr: string) => {
      if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
      if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

      reject(stderr);
    });
    command.on('end', (stdout: string, stderr: string) => {
      if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
      if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

      resolve(stdout);
    });
    command.run();
  });
};

const constructFfmpeg: (
  inputPath: string,
  startTime: number,
  duration: number,
  outputNumber: number
) => FfmpegCommand = (inputPath, startTime, duration, outputNumber) => {
  return ffmpeg()
    .input(inputPath)
    .setStartTime(startTime)
    .setDuration(duration)
    .output(`./temp/cut${outputNumber}.mp4`);
};

export const exportVideo: (
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
    mainWindow?.webContents.send(
      'finish-export',
      project,
      project.projectFilePath
    );
  }
};

export default exportVideo;
