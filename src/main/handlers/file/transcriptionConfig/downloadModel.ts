import setTranscriptionEngineConfig from './setEngineConfig';
import { OperatingSystems, TranscriptionEngine } from '../../../../sharedTypes';
import { IpcContext } from '../../../types';
import downloadZip from '../../../utils/file/downloadZip';
import {
  appDefaultLocalTranscriptionAssetsDirs,
  appDefaultLocalTranscriptionAssetsPaths,
} from '../../../utils/file/transcriptionConfig/helpers';

const onStart = (ipcContext: IpcContext) => () => {
  ipcContext.mainWindow?.webContents.send('start-download-model');
};

const onProgress = (ipcContext: IpcContext) => (progress: number) => {
  ipcContext.mainWindow?.webContents.send(
    'download-model-progress-update',
    progress
  );
};

const onFinish = (ipcContext: IpcContext) => () => {
  ipcContext.mainWindow?.webContents.send('finish-download-model');
};

const getModelUrl = () => {
  if (process.platform === OperatingSystems.LINUX)
    return 'https://mlvet-local.s3.ap-southeast-2.amazonaws.com/model-sml.zip';
  return 'https://mlvet-local.s3.ap-southeast-2.amazonaws.com/model.zip';
};

type DownloadModel = (ipcContext: IpcContext) => Promise<void>;

const downloadModel: DownloadModel = async (ipcContext) => {
  const { libsDir: libsAssetDir, modelDir: modelAssetDir } =
    appDefaultLocalTranscriptionAssetsDirs();

  const libsUrl = `https://mlvet-local.s3.ap-southeast-2.amazonaws.com/libs.zip`;
  const modelUrl = getModelUrl();

  console.log('Downloading dynamic libs');
  await downloadZip(
    libsUrl,
    libsAssetDir,
    onStart(ipcContext),
    () => {},
    () => {}
  );

  console.log('Downloading model');
  await downloadZip(
    modelUrl,
    modelAssetDir,
    () => {},
    onProgress(ipcContext),
    onFinish(ipcContext)
  );

  const { libsPath: libsAssetPath, modelPath: modelAssetPath } =
    appDefaultLocalTranscriptionAssetsPaths();

  // set config assets path
  await setTranscriptionEngineConfig(TranscriptionEngine.VOSK, {
    libsPath: libsAssetPath,
    modelPath: modelAssetPath,
  });
};

export default downloadModel;
