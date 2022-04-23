import path from 'path';

import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);

export default function extractAudio(
  absolutePathToMediaFile: string
): Promise<string> {
  const pathToSaveMedia = path.join(
    process.cwd(),
    'assets',
    'audio',
    'audio.wav'
  );

  console.log('Started audio extraction');

  const command = ffmpeg(absolutePathToMediaFile)
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
}
