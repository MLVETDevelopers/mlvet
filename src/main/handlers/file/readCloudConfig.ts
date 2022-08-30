import { readFileSync } from 'fs';
import { CloudConfig } from 'sharedTypes';
import { appCloudConfigPath } from '../../util';

type ReadCloudConfig = () => Promise<CloudConfig>;

const readCloudConfig: ReadCloudConfig = async () => {
  const cloudConfigPath = appCloudConfigPath();

  const cloudConfigBuffer = readFileSync(cloudConfigPath);
  try {
    const cloudConfigString = cloudConfigBuffer.toString();
    const cloudConfig: CloudConfig = JSON.parse(cloudConfigString);
    return cloudConfig;
  } catch (err) {
    throw new Error(`Error cloud config file: ${err}`);
  }
};

export default readCloudConfig;
