import { CloudConfig, LocalConfig } from 'sharedTypes';
import { fileOrDirExists } from '../../../util';

export const areCloudConfigRequirementsMet = (config: CloudConfig) => {
  return config.key !== null && config.key !== '';
};

export const isLocalModelConfiguredAndDownloaded = (config: LocalConfig) => {
  const isModelPathValid = config.modelPath !== null && config.modelPath !== '';
  return isModelPathValid && fileOrDirExists(config.modelPath as string);
};

export const isLocalLibsConfiguredAndDownloaded = (config: LocalConfig) => {
  const isLibsPathValid = config.libsPath !== null && config.libsPath !== '';
  return isLibsPathValid && fileOrDirExists(config.libsPath as string);
};

export const areLocalConfigRequirementsMet = (config: LocalConfig) => {
  return (
    isLocalLibsConfiguredAndDownloaded(config) &&
    isLocalModelConfiguredAndDownloaded(config)
  );
};
