import { BrowserWindow } from 'electron';
import { unlink } from 'fs/promises';
import path, { join } from 'path';
import { RuntimeProject, Cut } from '../../sharedTypes';
import { mkdir } from '../util';
import convertTranscriptToCuts from '../../transcriptProcessing/transcriptToCuts';
import ffmpeg from 'fluent-ffmpeg';
import { ffmpegPath } from '../ffUtils';

// type ExportMp4 = (project: RuntimeProject) => Promise<string>;

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
        // if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
        // if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

        console.log('cut video success');
        resolve(outputPath);
      })
      .on('error', (stdout: string, stderr: string) => {
        // if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
        // if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

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
    const tempCutVideo = createTempCutVideo(
      source ?? 'FILE PATH NOT FOUND',
      tempFileDir,
      cut.startTime,
      cut.duration,
      idx
    );
    // mainWindow?.webContents.send('export-progress-update', idx / entries);

    return tempCutVideo;
  });
};

const mergeTempCutVideos: (
  inputPaths: string[],
  outputPath: string,
  mainWindow: BrowserWindow | null
) => Promise<boolean> = (inputPaths, outputPath, mainWindow) => {
  let totalTime = 0;
  const mergedTempCut = ffmpeg();

  inputPaths.forEach((inputPath) => {
    mergedTempCut.mergeAdd(inputPath);
  });

  return new Promise((resolve, reject) => {
    mergedTempCut
      .mergeToFile(outputPath)
      .on('codeData', (data) => {
        totalTime = parseInt(data.duration.replace(/:/g, ''));
      })
      .on('progress', (progress) => {
        const time = parseInt(progress.timemark.replace(/:/g, ''));
        mainWindow?.webContents.send(
          'export-progress-update',
          time / totalTime
        );
      })
      .on('end', (stdout: string, stderr: string) => {
        // if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
        // if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

        console.log('merge video success');
        resolve(true);
      })
      .on('error', (stdout: string, stderr: string) => {
        // if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
        // if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

        console.log('merge video fail');
        reject(false);
      });
  });
};

const deleteTempCutVideos: (
  tempCutVideoPaths: string[],
  entries: number,
  mainWindow: BrowserWindow | null
) => Promise<void[]> = (tempCutVideoPaths, entries, mainWindow) => {
  return Promise.all(
    tempCutVideoPaths.map((tempVideo, idx) => {
      unlink(tempVideo);
      // mainWindow?.webContents.send('export-progress-update', (idx + 1) * 2 / entries);
    })
  );
};

// const deleteTempDir: (
//   tempCutVideoDir: string,
//   entries: number,
//   mainWindow: BrowserWindow | null
// ) => Promise<void> = async (tempCutVideoDir, entries, mainWindow) => {
//   return rmdir(tempCutVideoDir);
// };

const deleteTempCutFiles: (
  tempCutVideoPaths: string[],
  entries: number,
  mainWindow: BrowserWindow | null
) => void = async (tempCutVideoPaths, entries, mainWindow) => {
  await deleteTempCutVideos(tempCutVideoPaths, entries, mainWindow).catch(
    (error) => {
      console.error(error);
    }
  );
  // await deleteTempDir;
};

export const exportToMp4: (
  exportFilePath: string,
  mainWindow: BrowserWindow | null,
  project: RuntimeProject
) => Promise<void> = async (exportFilePath, mainWindow, project) => {
  ffmpeg.setFfmpegPath(ffmpegPath);
  if (project.transcription) {
    const cuts = convertTranscriptToCuts(project.transcription);
    const entries = cuts.length * 2;
  
    const exportFileDir = path.dirname(exportFilePath);
    const tempFileDir = join(exportFileDir, `/temp`);
    mkdir(tempFileDir);
  
    const tempCutVideoPaths = await Promise.all(
      allTempCutAllVideos(cuts, project.mediaFilePath, tempFileDir)
    );
  
    await mergeTempCutVideos(tempCutVideoPaths, exportFilePath, mainWindow);
  
    deleteTempCutFiles(tempCutVideoPaths, entries, mainWindow);

    mainWindow?.webContents.send(
      'finish-export',
      project,
      project.projectFilePath
    );
  }
};

export default exportToMp4;
