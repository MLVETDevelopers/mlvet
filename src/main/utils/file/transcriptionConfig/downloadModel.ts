import path from 'path';
import { getConfigsPath } from '../../../util';
import { OperatingSystems } from '../../../../sharedTypes';
import { readJsonFile } from '../file';

const downloadConfigFilename = 'localTranscriptionAssetsConfig.json';

export interface DownloadConfig {
  model: {
    url: string;
  };
  model_sml: {
    url: string;
  };
  libs: {
    url: string;
  };
}

export const getDownloadConfig: () => Promise<DownloadConfig> = async () => {
  const downloadConfigPathAbs = path.resolve(
    getConfigsPath(),
    downloadConfigFilename
  );

  const downloadConfig = (await readJsonFile(
    downloadConfigPathAbs
  )) as DownloadConfig;
  return downloadConfig;
};

export const shouldUseSmlModel = () => {
  return process.platform === OperatingSystems.LINUX;
};

export const getModelUrl = async () => {
  const downloadConfig = await getDownloadConfig();
  if (shouldUseSmlModel()) return downloadConfig.model_sml.url;
  return downloadConfig.model.url;
};

export const getLibsUrl = async () => {
  const downloadConfig = await getDownloadConfig();
  return downloadConfig.libs.url;
};

const createWeights = (
  libsProgressWeighting: number,
  modelProgressWeighting: number
) => ({ libsProgressWeighting, modelProgressWeighting });

export const calculateDownloadProgressWeights = async (
  shouldDownloadLibs: boolean,
  shouldDownloadModel: boolean
) => {
  if (shouldDownloadLibs && shouldDownloadModel) {
    if (shouldUseSmlModel()) return createWeights(0.36, 0.63);
    return createWeights(0.02, 0.97);
  }
  if (shouldDownloadLibs) return createWeights(0.99, 0);
  if (shouldDownloadModel) return createWeights(0, 0.99);
  return createWeights(0, 0);
};
