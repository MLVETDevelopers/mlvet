import path from 'path';

import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { path as ffprobePath } from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

export default function extractThumbnail(
  absolutePathToVideoFile: string
): Promise<string> {
  const pathToSaveMedia = path.join(process.cwd(), 'assets', 'thumbnails');

  console.log('Started thumbnail extraction');

  const command = ffmpeg(absolutePathToVideoFile).thumbnails({
    count: 1,
    filename: 'thumbnail.png',
    folder: pathToSaveMedia,
  });

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
