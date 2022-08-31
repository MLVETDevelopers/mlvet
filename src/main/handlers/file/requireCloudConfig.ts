import { findDefaultEngineConfig } from '../../../sharedUtils';
import { appCloudConfigPath, fileOrDirExists } from '../../util';
import readCloudConfig from './readCloudConfig';

type RequireCloudConfig = () => Promise<boolean>;

const requireCloudConfig: RequireCloudConfig = async () => {
  const cloudConfigPath = appCloudConfigPath();
  if (fileOrDirExists(cloudConfigPath)) {
    const cloudConfig = await readCloudConfig();
    const engineConfig = findDefaultEngineConfig(cloudConfig);
    return engineConfig === null;
  }
  return true;
};

export default requireCloudConfig;
