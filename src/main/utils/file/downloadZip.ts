import extract from 'extract-zip';
import fs from 'fs';
import path from 'path';
import downloadFile from './downloadFile';

type DownloadZip = (
  url: string,
  targetFile: string,
  onStartCallback: () => void,
  onProgressCallback: (progress: number) => void,
  onFinishCallback: () => void
) => Promise<void>;

/**
 * Downloads and extracts a .zip file from the given `url` to the `targetDir`.
 */
const downloadZip: DownloadZip = async (
  url,
  targetDir,
  onStartCallback,
  onProgressCallback,
  onFinishCallback
) => {
  if (targetDir.endsWith('.zip'))
    throw new Error(
      'targetFile should be the path to the directory to extract the zip to'
    );

  const dir = targetDir.endsWith('.zip') ? path.dirname(targetDir) : targetDir;
  const zipPath = path.join(dir, 'temp.zip');

  await downloadFile(
    url,
    zipPath,
    onStartCallback,
    onProgressCallback,
    onFinishCallback
  );

  await extract(zipPath, { dir });

  fs.unlinkSync(zipPath);
};

export default downloadZip;
