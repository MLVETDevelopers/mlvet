import setTranscriptionEngineConfig from './setEngineConfig';
import {
  DownloadingModelState,
  LocalConfig,
  OperatingSystems,
  TranscriptionEngine,
} from '../../../../sharedTypes';
import { IpcContext } from '../../../types';
import downloadZip from '../../../utils/file/downloadZip';
import {
  appDefaultLocalTranscriptionAssetsDirs,
  appDefaultLocalTranscriptionAssetsPaths,
} from '../../../utils/file/transcriptionConfig/helpers';
import {
  isLocalLibsConfiguredAndDownloaded,
  isLocalModelConfiguredAndDownloaded,
} from '../../../utils/file/transcriptionConfig/checkConfig';
import getTranscriptionEngineConfig from './getEngineConfig';

const MODEL_URL =
  'https://mlvet-local.s3.ap-southeast-2.amazonaws.com/model.zip';
const MODEL_SML_URL =
  'https://mlvet-local.s3.ap-southeast-2.amazonaws.com/model-sml.zip';
const LIBS_URL = `https://mlvetdevelopers.github.io/mlvet-local-transcription-assets/libs.zip`;

const onDownloadStart = (ipcContext: IpcContext) => () => {
  const downloadModelStateUpdate = {
    type: DownloadingModelState.START_DOWNLOAD,
    payload: null,
  };
  ipcContext.mainWindow?.webContents.send(
    'update-download-model-state',
    downloadModelStateUpdate
  );
};

const onDownloadProgressUpdate =
  (ipcContext: IpcContext) => (progress: number) => {
    const downloadModelStateUpdate = {
      type: DownloadingModelState.DOWNLOAD_PROGRESS_UPDATE,
      payload: { progress },
    };
    ipcContext.mainWindow?.webContents.send(
      'update-download-model-state',
      downloadModelStateUpdate
    );
  };

const onDownloadFinish = (ipcContext: IpcContext) => () => {
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
  if (process.platform === OperatingSystems.LINUX) return MODEL_SML_URL;
  return MODEL_URL;
};

const getLibsUrl = () => LIBS_URL;

const getLocalConfig = async (): Promise<LocalConfig> => {
  const config = (await getTranscriptionEngineConfig(
    TranscriptionEngine.VOSK
  )) as LocalConfig;
  return config;
};

const createWeights = (
  libsProgressWeighting: number,
  modelProgressWeighting: number
) => ({ libsProgressWeighting, modelProgressWeighting });

const calculateDownloadProgressWeights = (
  shouldDownloadLibs: boolean,
  shouldDownloadModel: boolean
) => {
  if (shouldDownloadLibs && shouldDownloadModel) {
    if (getModelUrl() === MODEL_SML_URL) return createWeights(0.36, 0.63);
    return createWeights(0.02, 0.97);
  }
  if (shouldDownloadLibs) return createWeights(0.99, 0);
  if (shouldDownloadModel) return createWeights(0, 0.99);
  return createWeights(0, 0);
};

type DownloadModel = (ipcContext: IpcContext) => Promise<void>;

const downloadModel: DownloadModel = async (ipcContext) => {
  // Trigger download start frontend
  onDownloadStart(ipcContext)();

  const localConfig = await getLocalConfig();
  const shouldDownloadLibs = !isLocalLibsConfiguredAndDownloaded(localConfig);
  const shouldDownloadModel = !isLocalModelConfiguredAndDownloaded(localConfig);

  // Set progress update weightings for libs and model
  const { libsProgressWeighting, modelProgressWeighting } =
    calculateDownloadProgressWeights(shouldDownloadLibs, shouldDownloadModel);

  // Get default dirs to download and extract local assets to
  const { libsDir: defaultLibsDir, modelDir: defaultModelDir } =
    appDefaultLocalTranscriptionAssetsDirs();

  // Pass IPC context into function
  const onProgress = onDownloadProgressUpdate(ipcContext);

  // Download and extract libs if not already present
  if (shouldDownloadLibs) {
    console.log('Downloading dynamic libs');
    await downloadZip(
      getLibsUrl(),
      defaultLibsDir,
      () => {},
      (progress: number) => {
        const weightedProgress = progress * libsProgressWeighting;
        onProgress(weightedProgress);
      },
      () => {}
    );
  }

  // Download and extract model if not already present
  if (shouldDownloadModel) {
    console.log('Downloading model');
    await downloadZip(
      getModelUrl(),
      defaultModelDir,
      () => {},
      (progress: number) => {
        const weightedProgress =
          progress * modelProgressWeighting + libsProgressWeighting;
        onProgress(weightedProgress);
      },
      () => {}
    );
  }

  // set config assets path to default paths if not already defined
  const { libsPath: defaultLibsPath, modelPath: defaultModelPath } =
    appDefaultLocalTranscriptionAssetsPaths();

  await setTranscriptionEngineConfig(TranscriptionEngine.VOSK, {
    libsPath: shouldDownloadLibs ? defaultLibsPath : localConfig.libsPath,
    modelPath: shouldDownloadModel ? defaultModelPath : localConfig.modelPath,
  });

  // Trigger download finish frontend
  onDownloadFinish(ipcContext)();
};

export default downloadModel;
