import { BrowserWindow } from 'electron';
import { unlink } from 'fs/promises';
import path, { join } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { RuntimeProject, Cut } from '../../sharedTypes';
import { mkdir } from '../util';
import convertTranscriptToCuts from '../../transcriptProcessing/transcriptToCuts';
import { ffmpegPath } from '../ffUtils';

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
      .on('end', (stdout: string, stderr: string) => {
        if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
        if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

        console.log('cut video success');
        resolve(outputPath);
      })
      .on('error', (stdout: string, stderr: string) => {
        if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
        if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

        console.log('cut video error');
        reject(stderr);
      })
      .run();
  });
};

const allTempCutAllVideos: (
  cuts: Cut[],
  source: string | null,
  tempFileDir: string
) => Promise<string>[] = (cuts, source, tempFileDir) => {
  return cuts.map((cut, idx) => {
    return createTempCutVideo(
      source ?? 'FILE PATH NOT FOUND',
      tempFileDir,
      cut.startTime,
      cut.duration,
      idx
    );
  });
};

const mergeTempCutVideos: (
  inputPaths: string[],
  outputPath: string
) => Promise<boolean> = (inputPaths, outputPath) => {
  const mergedTempCut = ffmpeg();

  inputPaths.forEach((inputPath) => {
    mergedTempCut.mergeAdd(inputPath);
  });

  return new Promise((resolve, reject) => {
    mergedTempCut
      .mergeToFile(outputPath)
      .on('end', (stdout: string, stderr: string) => {
        if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
        if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

        resolve(true);
      })
      .on('error', (stdout: string, stderr: string) => {
        if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
        if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

        reject(stderr);
      });
  });
};

const deleteTempCutVideos: (tempCutVideoPaths: string[]) => Promise<void[]> = (
  tempCutVideoPaths
) => {
  return Promise.all(
    tempCutVideoPaths.map((tempVideo) => {
      return unlink(tempVideo);
    })
  );
};

const deleteTempCutFiles: (tempCutVideoPaths: string[]) => void = async (
  tempCutVideoPaths
) => {
  await deleteTempCutVideos(tempCutVideoPaths).catch((error) => {
    console.error(error);
  });
};

export const exportToMp4: (
  exportFilePath: string,
  mainWindow: BrowserWindow | null,
  project: RuntimeProject
) => Promise<void> = async (exportFilePath, mainWindow, project) => {
  ffmpeg.setFfmpegPath(ffmpegPath);
  if (project.transcription) {
    const cuts = convertTranscriptToCuts(project.transcription);

    const exportFileDir = path.dirname(exportFilePath);
    const tempFileDir = join(exportFileDir, '/temp');
    mkdir(tempFileDir);

    const tempCutVideoPaths = await Promise.all(
      allTempCutAllVideos(cuts, project.mediaFilePath, tempFileDir)
    );

    // hard coded for now
    mainWindow?.webContents.send('export-progress-update', 0.5);

    await mergeTempCutVideos(tempCutVideoPaths, exportFilePath);

    deleteTempCutFiles(tempCutVideoPaths);
  }
};

export default exportToMp4;
