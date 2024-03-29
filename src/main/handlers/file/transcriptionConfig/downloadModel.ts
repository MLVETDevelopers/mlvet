import { moveSync } from 'fs-extra';
import path from 'path';
import setTranscriptionEngineConfig from './setEngineConfig';
import {
  DownloadingModelState,
  LocalConfig,
  TranscriptionEngine,
} from '../../../../sharedTypes';
import { IpcContext } from '../../../types';
import downloadZip from '../../../utils/file/downloadZip';
import { getFilesParentDir, renameFileOrDir } from '../../../utils/file/file';
import {
  appDefaultLocalTranscriptionAssetsDirs,
  appDefaultLocalTranscriptionAssetsPaths,
} from '../../../utils/file/transcriptionConfig/helpers';
import {
  isLocalLibsConfiguredAndDownloaded,
  isLocalModelConfiguredAndDownloaded,
} from '../../../utils/file/transcriptionConfig/checkConfig';
import getTranscriptionEngineConfig from './getEngineConfig';
import {
  calculateDownloadProgressWeights,
  getLibsUrl,
  getModelUrl,
} from '../../../utils/file/transcriptionConfig/downloadModel';

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

const getLocalConfig = async (): Promise<LocalConfig> => {
  const config = (await getTranscriptionEngineConfig(
    TranscriptionEngine.VOSK
  )) as LocalConfig;
  return config;
};

const downloadAndExtractLibs = async (
  defaultLibsDir: string,
  libsProgressWeighting: number,
  onProgress: (progress: number) => void
) => {
  console.log('Downloading dynamic libs');

  await downloadZip(
    await getLibsUrl(),
    defaultLibsDir,
    () => {},
    (progress: number) => {
      const weightedProgress = progress * libsProgressWeighting;
      onProgress(weightedProgress);
    },
    () => {}
  );
};

const downloadAndExtractModel = async (
  defaultModelDir: string,
  modelProgressWeighting: number,
  libsProgressWeighting: number,
  onProgress: (progress: number) => void
) => {
  console.log('Downloading model');

  await downloadZip(
    await getModelUrl(),
    defaultModelDir,
    () => {},
    (progress: number) => {
      const weightedProgress =
        progress * modelProgressWeighting + libsProgressWeighting;
      onProgress(weightedProgress);
    },
    () => {}
  );

  const modelFiles = ['am', 'conf', 'graph'];

  // Get the path to model after download and extraction
  const downloadedModelPath = await getFilesParentDir(
    defaultModelDir,
    modelFiles
  );

  if (downloadedModelPath !== null) {
    // Rename the model (eg: 'vosk-model-small-en-us-0.15') to 'model'
    const downloadedModelParentDir = path.dirname(downloadedModelPath);
    const newModelPath = path.resolve(downloadedModelParentDir, 'model');
    renameFileOrDir(downloadedModelPath, newModelPath);

    // Move the model to the default model dir, if it isn't there already
    const defaultModelPath = path.resolve(defaultModelDir, 'model');
    if (newModelPath !== defaultModelPath)
      moveSync(newModelPath, defaultModelPath, {
        overwrite: true,
      });
  }
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
    await calculateDownloadProgressWeights(
      shouldDownloadLibs,
      shouldDownloadModel
    );

  // Get default dirs to download and extract local assets to
  const { libsDir: defaultLibsDir, modelDir: defaultModelDir } =
    appDefaultLocalTranscriptionAssetsDirs();

  // Pass IPC context into function
  const onProgress = onDownloadProgressUpdate(ipcContext);

  // Download and extract libs if not already present
  if (shouldDownloadLibs) {
    await downloadAndExtractLibs(
      defaultLibsDir,
      libsProgressWeighting,
      onProgress
    );
  }

  // Download and extract model if not already present
  if (shouldDownloadModel) {
    await downloadAndExtractModel(
      defaultModelDir,
      modelProgressWeighting,
      libsProgressWeighting,
      onProgress
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
