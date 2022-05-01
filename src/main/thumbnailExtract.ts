import path from 'path';

import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);

export default function extractThumbnail(
  absolutePathToVideoFile: string
): Promise<string> {
  const pathToSaveMedia = path.join(
    process.cwd(),
    'assets',
    'thumbnails',
    'thumbnail.png'
  );

  console.log('Started thumbnail extraction');

  const command = ffmpeg(absolutePathToVideoFile)
    .thumbnails(1)
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
