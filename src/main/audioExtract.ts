import { ChildProcess, spawn } from 'child_process';
import path from 'path';

export default function extractAudio(
  absolutePathToMediaFile: string
): ChildProcess {
  const pathToSaveMedia = path.join(
    process.cwd(),
    'assets',
    'videos',
    'audio.wav'
  );

  // Original command is:
  // ffmpeg -i input.mp4 -ac 1 -ar 16000 -vn output.wav
  // i've added `-f wav` which forces the output to .wav
  // TODO: figure out how to save output to a directory as right now it saves the output to the directory it is in
  // docs: https://ffmpeg.org/ffmpeg.html
  const proc = spawn('ffmpeg', [
    '-i',
    absolutePathToMediaFile,
    '-ac',
    '1',
    '-ar',
    '16000',
    '-vn',
    '-f',
    'wav',
    'audio.wav',
  ]);

  return proc;
}
