import { ChildProcess, spawn } from 'child_process';
import path from 'path';

export default function extractAudio(
  absolutePathToMediaFile: string
): ChildProcess {
  const pathToSaveMedia = path.join(process.cwd(), 'assets', 'videos');

  // Original command is:
  // ffmpeg -i input.mp4 -ac 1 -ar 16000 -vn output.wav
  const proc = spawn(
    'ffmpeg',
    [
      '-i',
      absolutePathToMediaFile,
      '-ac',
      '1',
      '-ar',
      '16000',
      '-vn',
      'audio.wav',
    ],
    { cwd: pathToSaveMedia }
  );

  return proc;
}
