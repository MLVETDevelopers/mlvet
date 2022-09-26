import path from 'path';
import downloadFile from '../../../utils/file/downloadFile';
import { appLocalTranscriptionAssetsPath, mkdir } from '../../../util';
import setTranscriptionEngineConfig from './setEngineConfig';
import { TranscriptionEngine } from '../../../../sharedTypes';
import { IpcContext } from '../../../types';

type DownloadModel = (ipcContext: IpcContext) => Promise<void>;

const downloadModel: DownloadModel = async (ipcContext) => {
  const { mainWindow } = ipcContext;

  const assetsPath = appLocalTranscriptionAssetsPath();

  // const modelUrl =
  //   'https://drive.google.com/file/d/1IqLeOvDfpqhHdq5Nx6VhISI6EBoh-tX4/view?usp=sharing';
  // const modelAssetPath = path.join(assetsPath, 'model');
  // mkdir(path.dirname(modelAssetPath));

  // await downloadFile(modelUrl, modelAssetPath);
  const libsUrl = `https://mlvet-local.s3.ap-southeast-2.amazonaws.com/VoskDLLs.zip`;
  const libsAssetPath = path.join(assetsPath, 'libs', 'test.zip');
  mkdir(path.dirname(libsAssetPath));

  const onStart = () => {
    mainWindow?.webContents.send('start-download-model');
  };

  const onProgress = (progress: number) => {
    mainWindow?.webContents.send('download-model-progress-update', progress);
  };

  const onFinish = () => {
    mainWindow?.webContents.send('finish-download-model');
  };

  await downloadFile(libsUrl, libsAssetPath, onStart, onProgress, onFinish);

  // set config assets path
  await setTranscriptionEngineConfig(TranscriptionEngine.VOSK, {
    assetPath: assetsPath,
  });
};

export default downloadModel;
