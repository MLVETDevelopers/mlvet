import { CloudConfig, LocalConfig } from 'sharedTypes';
import { fileOrDirExists } from '../../../util';

export const areCloudConfigRequirementsMet = (config: CloudConfig) => {
  return config.key !== null && config.key !== '';
};

export const areLocalConfigRequirementsMet = (config: LocalConfig) => {
  const isModelPathValid = config.modelPath !== null && config.modelPath !== '';
  const isLibsPathValid = config.libsPath !== null && config.libsPath !== '';
  return (
    isModelPathValid &&
    isLibsPathValid &&
    fileOrDirExists(config.modelPath as string) &&
    fileOrDirExists(config.libsPath as string)
  );
};
