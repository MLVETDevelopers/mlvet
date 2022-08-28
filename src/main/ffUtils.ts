import ffmpegStaticPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';

export const ffmpegPath = ffmpegStaticPath.replace(
  'app.asar\\dist\\main\\',
  'ffmpeg-static\\'
);

export const ffprobePath = ffprobeStatic.path.replace(
  'app.asar\\dist\\main\\',
  'ffprobe-static\\'
);
