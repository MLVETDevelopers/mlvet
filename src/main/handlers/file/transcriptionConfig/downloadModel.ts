import setTranscriptionEngineConfig from './setEngineConfig';
import {
  DownloadingModelState,
  OperatingSystems,
  TranscriptionEngine,
} from '../../../../sharedTypes';
import { IpcContext } from '../../../types';
import downloadZip from '../../../utils/file/downloadZip';
import {
  appDefaultLocalTranscriptionAssetsDirs,
  appDefaultLocalTranscriptionAssetsPaths,
} from '../../../utils/file/transcriptionConfig/helpers';

const onStart = (ipcContext: IpcContext) => () => {
  const downloadModelStateUpdate = {
    type: DownloadingModelState.START_DOWNLOAD,
    payload: null,
  };
  ipcContext.mainWindow?.webContents.send(
    'update-download-model-state',
    downloadModelStateUpdate
  );
};

const onProgress = (ipcContext: IpcContext) => (progress: number) => {
  const downloadModelStateUpdate = {
    type: DownloadingModelState.DOWNLOAD_PROGRESS_UPDATE,
    payload: { progress },
  };
  ipcContext.mainWindow?.webContents.send(
    'update-download-model-state',
    downloadModelStateUpdate
  );
};

const onFinish = (ipcContext: IpcContext) => () => {
  const downloadModelStateUpdate = {
    type: DownloadingModelState.FINISH_DOWNLOAD,
    payload: null,
  };
  ipcContext.mainWindow?.webContents.send(
    'update-download-model-state',
    downloadModelStateUpdate
  );
};

const getModelUrl = () => {
  if (process.platform === OperatingSystems.LINUX)
    return 'https://mlvet-local.s3.ap-southeast-2.amazonaws.com/model-sml.zip';
  return 'https://mlvet-local.s3.ap-southeast-2.amazonaws.com/model-sml.zip';
};

type DownloadModel = (ipcContext: IpcContext) => Promise<void>;

const downloadModel: DownloadModel = async (ipcContext) => {
  const { libsDir: libsAssetDir, modelDir: modelAssetDir } =
    appDefaultLocalTranscriptionAssetsDirs();

  const libsUrl = `https://mlvet-local.s3.ap-southeast-2.amazonaws.com/libs.zip`;
  const modelUrl = getModelUrl();

  // Set progress update weightings for libs and model
  const libsProgressWeighting = 0.1;
  const onStartInitialised = onStart(ipcContext);
  const onProgressInitialised = onProgress(ipcContext);
  const onFinishInitialised = onFinish(ipcContext);

  console.log('Downloading dynamic libs');
  await downloadZip(
    libsUrl,
    libsAssetDir,
    onStartInitialised,
    (progress: number) => {
      const weightedProgress = progress * libsProgressWeighting;
      onProgressInitialised(weightedProgress);
    },
    () => {}
  );

  console.log('Downloading model');
  await downloadZip(
    modelUrl,
    modelAssetDir,
    () => {},
    (progress: number) => {
      const weightedProgress =
        progress * (1 - libsProgressWeighting) + libsProgressWeighting;
      onProgressInitialised(weightedProgress);
    },
    () => {}
  );

  onFinishInitialised();

  const { libsPath: libsAssetPath, modelPath: modelAssetPath } =
    appDefaultLocalTranscriptionAssetsPaths();

  // set config assets path
  await setTranscriptionEngineConfig(TranscriptionEngine.VOSK, {
    libsPath: libsAssetPath,
    modelPath: modelAssetPath,
  });
};

export default downloadModel;
