import { CloudConfig, LocalConfig } from 'sharedTypes';
import path from 'path';
import { fileOrDirExists } from '../../../util';

export const areCloudConfigRequirementsMet = (config: CloudConfig) => {
  return config.key !== null && config.key !== '';
};

export const areLocalConfigRequirementsMet = (config: LocalConfig) => {
  const isAssetPathValid = config.assetPath !== null && config.assetPath !== '';
  return (
    isAssetPathValid &&
    fileOrDirExists(path.join(config.assetPath as string, 'libs')) &&
    fileOrDirExists(path.join(config.assetPath as string, 'voskModel'))
  );
};
