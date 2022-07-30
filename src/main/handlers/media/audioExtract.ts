import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import { RuntimeProject } from 'sharedTypes';
import { getAudioExtractPath, getProjectDataDir, mkdir } from '../../util';

ffmpeg.setFfmpegPath(ffmpegPath);

type ExtractAudio = (project: RuntimeProject) => Promise<string>;

const extractAudio: ExtractAudio = (project) => {
  if (project.mediaFilePath === null || project.id === null) {
    return new Promise((_resolve, reject) => {
      const errorMessage = 'Project mediaFilePath or ID cannot be null';
      reject(errorMessage);
    });
  }

  mkdir(getProjectDataDir(project.id));

  const pathToSaveMedia = getAudioExtractPath(project.id);

  console.log('Started audio extraction');

  const command = ffmpeg(project.mediaFilePath)
    .audioChannels(1)
    .outputOptions('-ar 16000') // Sample rate of 16kHz
    .noVideo()
    .saveToFile(pathToSaveMedia);

  return new Promise((resolve, reject) => {
    command.on('end', (stdout: string, stderr: string) => {
      if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
      if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

      resolve(pathToSaveMedia);
    });
    command.on('error', (stdout: string, stderr: string) => {
      if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
      if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

      reject(stderr);
    });
  });
};

export default extractAudio;
