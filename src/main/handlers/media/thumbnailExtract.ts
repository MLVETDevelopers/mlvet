import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { getProjectDataDir } from '../../util';
import { RuntimeProject } from '../../../sharedTypes';
import { ffmpegPath, ffprobePath } from '../../ffUtils';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

type ExtractThumbnail = (
  absolutePathToVideoFile: string,
  project: RuntimeProject
) => Promise<string>;

const extractThumbnail: ExtractThumbnail = (
  absolutePathToMediaFile,
  project
) => {
  const pathToSaveMedia = getProjectDataDir(project.id);

  console.log('Started thumbnail extraction');

  const filename = 'thumbnail.png';

  // By Default the image is picked from the middle of the video.
  const command = ffmpeg(absolutePathToMediaFile).thumbnails({
    count: 1,
    filename,
    folder: pathToSaveMedia,
  });

  return new Promise((resolve, reject) => {
    command.on('end', (stdout: string, stderr: string) => {
      if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
      if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

      resolve(path.join(pathToSaveMedia, filename));
    });
    command.on('error', (stdout: string, stderr: string) => {
      if (stdout) console.log(`FFMPEG stdout: ${stdout}`);
      if (stderr) console.error(`FFMPEG stderr: ${stderr}`);

      reject(stderr);
    });
  });
};

export default extractThumbnail;
