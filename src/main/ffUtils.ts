import ffmpegStaticPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';
import path from 'path';

export const ffmpegPath = ffmpegStaticPath.replace(
  path.join('app.asar', 'dist', 'main'),
  path.join('ffmpeg-static')
);

export const ffprobePath = ffprobeStatic.path.replace(
  path.join('app.asar', 'dist', 'main'),
  path.join('ffprobe-static')
);
