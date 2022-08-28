import ffmpegStaticPath from 'ffmpeg-static';
import ffprobeStatic from 'ffprobe-static';

console.log = require('electron-log').info;

console.log('ffmpegstaticPath', ffmpegStaticPath);
console.log('ffprobestaticPath', ffprobeStatic);

export const ffmpegPath = ffmpegStaticPath.replace(
  'app.asar',
  'app.asar.unpacked'
);

console.log(ffmpegPath);

export const ffprobePath = ffprobeStatic.path.replace(
  'app.asar',
  'app.asar.unpacked'
);

console.log(ffprobePath);
