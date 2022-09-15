import { BrowserWindow } from 'electron';
import { unlink, rmdir } from 'fs';
import path, { join } from 'path';
import { RuntimeProject, Transcription } from '../../sharedTypes';
import { mkdir } from '../util';
import convertTranscriptToCuts from '../../transcriptProcessing/transcriptToCuts';
import ffmpeg from 'fluent-ffmpeg';
import { ffmpegPath } from '../ffUtils';

ffmpeg.setFfmpegPath(ffmpegPath);

type ExportMp4 = (project: RuntimeProject) => Promise<string>;

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

const deleteTempCutVideos: (tempCutVideoPaths: string[]) => Promise<void[]> = (tempCutVideoPaths) => {
  return Promise.all(
    tempCutVideoPaths.map((tempVideo) => {
      new Promise((resolve, reject) => {
        unlink(tempVideo, (error) => {
          if (error) {
            console.error(error)
            reject(false);
          } else {
            resolve(true);
          }
        });
      });
    })
  );
};

const deleteTempDir: (tempCutVideosDir: string) => Promise<void> = (tempCutVideosDir) => {
  return new Promise((resolve, reject) => {
    rmdir(tempCutVideosDir, (error) => {
      if (error) {
        console.error(error)
        reject;
      } else {
        resolve;
      }
    });
  });
};

const deleteTempCutFiles: (
  tempCutVideoPaths: string[],
  tempCutVideosDir: string
) => void = async (tempCutVideoPaths, tempCutVideosDir) => {
  await deleteTempCutVideos(tempCutVideoPaths);
  // await deleteTempDir(tempCutVideosDir);
};

export const exportMp4 = async (
  exportFilePath: string,
  transcription: Transcription,
  source: string | null
) => {
  const cuts = convertTranscriptToCuts(transcription);

  const exportFileDir = path.dirname(exportFilePath);
  const tempFileDir = join(exportFileDir, `/temp`);
  mkdir(tempFileDir);

  const tempCutVideos = cuts.map((cut, idx) => {
    return createTempCutVideo(
      source ?? 'FILE PATH NOT FOUND',
      tempFileDir,
      cut.startTime,
      cut.duration,
      idx
    );
  });

  const tempCutPaths = await Promise.all(tempCutVideos);

  await mergeTempCutVideos(tempCutPaths, exportFilePath);
  
  deleteTempCutFiles(tempCutPaths, tempFileDir);
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
    exportMp4(exportFilePath, project.transcription, project.mediaFilePath);

    mainWindow?.webContents.send(
      'finish-export',
      project,
      project.projectFilePath
    );
  }
};

export default exportVideo;
