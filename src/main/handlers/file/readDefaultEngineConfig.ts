import { EngineConfig } from '../../../sharedTypes';
import { findDefaultEngineConfig } from '../../../sharedUtils';
import { appCloudConfigPath, fileOrDirExists } from '../../util';
import readCloudConfig from './readCloudConfig';

type ReadDefaultEngineConfig = () => Promise<EngineConfig>;

const readDefaultEngineConfig: ReadDefaultEngineConfig = async () => {
  if (!fileOrDirExists(appCloudConfigPath())) {
    const cloudConfig = await readCloudConfig();
    if (cloudConfig !== null) {
      const defaultEngineConfig = findDefaultEngineConfig(cloudConfig);
      return defaultEngineConfig;
    }
  }

  return null;
};

export default readDefaultEngineConfig;
