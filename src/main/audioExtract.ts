import { ChildProcess, spawn } from 'child_process';
import path from 'path';

import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);

export default function extractAudio(absolutePathToMediaFile: string): void {
  const pathToSaveMedia = path.join(process.cwd(), 'assets', 'videos');

  const command = ffmpeg(absolutePathToMediaFile)
    .audioChannels(1)
    .outputOptions('-ar 16000')
    .noVideo()
    .saveToFile('audio.wav');

  // Original command is:
  // ffmpeg -i input.mp4 -ac 1 -ar 16000 -vn output.wav
  // const proc = spawn(
  //   'ffmpeg',
  //   [
  //     '-i',
  //     absolutePathToMediaFile,
  //     '-ac',
  //     '1',
  //     '-ar',
  //     '16000',
  //     '-vn',
  //     'audio.wav',
  //   ],
  //   { cwd: pathToSaveMedia }
  // );

  // return proc;
}
