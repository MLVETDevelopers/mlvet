import ffmpegStaticPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';

export const ffmpegPath = ffmpegStaticPath.replace(
  'app.asar',
  'app.asar.unpacked'
);

export const ffprobePath = ffprobeStatic.path.replace(
  'app.asar',
  'app.asar.unpacked'
);
