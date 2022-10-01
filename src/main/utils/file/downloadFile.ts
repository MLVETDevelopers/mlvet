import wget from 'wget-improved';
import path from 'path';
import { mkdir } from '../../util';

type DownloadFile = (
  url: string,
  targetFile: string,
  onStartCallback: () => void,
  onProgressCallback: (progress: number) => void,
  onFinishCallback: () => void
) => Promise<void>;

/**
 * Download a file from the given `url` into the `targetFile`.
 */
const downloadFile: DownloadFile = async (
  url,
  targetFile,
  onStartCallback,
  onProgressCallback,
  onFinishCallback
) => {
  const options = {
    protocol: 'https',
    method: 'GET',
  };

  const dirPath = path.dirname(targetFile);

  mkdir(dirPath);

  return new Promise((resolve, reject) => {
    const download = wget.download(url, targetFile, options);

    download.on('error', (err: any) => {
      reject(err);
    });
    download.on('start', () => {
      onStartCallback();
    });
    download.on('progress', (progress: number) => {
      onProgressCallback(progress);
    });
    download.on('end', () => {
      onFinishCallback();
      resolve();
    });
  });
};

export default downloadFile;
