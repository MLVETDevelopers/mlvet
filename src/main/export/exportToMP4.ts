import { BrowserWindow } from 'electron';
import { unlink } from 'fs/promises';
import path, { join } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { RuntimeProject, Cut } from '../../sharedTypes';
import { mkdir } from '../util';
import convertTranscriptToCuts from '../../transcriptProcessing/transcriptToCuts';
import { ffmpegPath } from '../ffUtils';

interface ProgressUpdate {
  frames: number;
  currentFps: number;
  currentKbps: number;
  targetSize: number;
  timemark: string;
  percent: number;
}

const createTempCutVideo: (
  inputPath: string,
  outputDir: string,
  startTime: number,
  duration: number,
  outputNumber: number
) => Promise<string> = (
  inputPath,
  outputDir,
  startTime,
  duration,
  outputNumber
) => {
  const outputPath = join(outputDir, `/cut${outputNumber}.mp4`);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .output(outputPath)
      .on('end', () => {
        resolve(outputPath);
      })
      .on('error', (err: Error) => {
        reject(err);
      })
      .run();
  });
};

const allTempCutAllVideos: (
  cuts: Cut[],
  source: string | null,
  tempFileDir: string,
  mainWindow: BrowserWindow | null
) => Promise<string[]> = (cuts, source, tempFileDir, mainWindow) => {
  const allTempCutAllVideosPromise = cuts.map((cut, idx) => {
    return createTempCutVideo(
      source ?? 'FILE PATH NOT FOUND',
      tempFileDir,
      cut.startTime,
      cut.duration,
      idx
    );
  });

  const tempCutVideoPathsPromise = Promise.all(allTempCutAllVideosPromise);

  let tempCutVideoCompleteNum = 0;
  allTempCutAllVideosPromise.forEach((promise) =>
    promise.then(() => {
      tempCutVideoCompleteNum += 1;
      const progress =
        (tempCutVideoCompleteNum / allTempCutAllVideosPromise.length) * 0.5;
      // eslint-disable-next-line promise/always-return
      mainWindow?.webContents.send('export-progress-update', progress);
    })
  );

  return tempCutVideoPathsPromise;
};

const mergeTempCutVideos: (
  inputPaths: string[],
  outputPath: string,
  totalTime: number,
  mainWindow: BrowserWindow | null
) => Promise<void> = (inputPaths, outputPath, totalTime, mainWindow) => {
  const mergedTempCut = ffmpeg();

  inputPaths.forEach((inputPath) => {
    mergedTempCut.mergeAdd(inputPath);
  });

  return new Promise((resolve, reject) => {
    mergedTempCut
      .mergeToFile(outputPath)
      .on('progress', (progress: ProgressUpdate) => {
        const time = parseInt(progress.timemark.replace(/:/g, ''), 10);
        const percent = (time / totalTime) * 0.4 + 0.5;

        mainWindow?.webContents.send('export-progress-update', percent);
      })
      .on('end', () => {
        resolve();
      })
      .on('error', (err: Error) => {
        reject(err);
      });
  });
};

const deleteTempCutVideos: (
  tempCutVideoPaths: string[]
) => Promise<void> = async (tempCutVideoPaths) => {
  await Promise.all(
    tempCutVideoPaths.map((tempVideo) => {
      return unlink(tempVideo);
    })
  );
};

const deleteTempCutFiles: (
  tempCutVideoPaths: string[]
) => Promise<void> = async (tempCutVideoPaths) => {
  await deleteTempCutVideos(tempCutVideoPaths).catch((error) => {
    throw new Error(error);
  });
};

export const exportToMp4: (
  exportFilePath: string,
  mainWindow: BrowserWindow | null,
  project: RuntimeProject
) => Promise<void> = async (exportFilePath, mainWindow, project) => {
  ffmpeg.setFfmpegPath(ffmpegPath);
  if (project.transcription === null) {
    return;
  }

  const cuts = convertTranscriptToCuts(project.transcription);

  let fixedExportFilePath = exportFilePath;
  const extnName = path.extname(exportFilePath);

  if (!extnName) fixedExportFilePath = `${exportFilePath}.mp4`;

  const exportFileDir = path.dirname(fixedExportFilePath);
  const tempFileDir = join(exportFileDir, '/temp');
  mkdir(tempFileDir);

  const tempCutVideoPaths = await allTempCutAllVideos(
    cuts,
    project.mediaFilePath,
    tempFileDir,
    mainWindow
  );

  const totalTime = project.transcription.duration;
  await mergeTempCutVideos(
    tempCutVideoPaths,
    fixedExportFilePath,
    totalTime,
    mainWindow
  );

  await deleteTempCutFiles(tempCutVideoPaths);
};

export default exportToMp4;
