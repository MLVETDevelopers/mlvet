import { unlinkSync, readFileSync } from 'fs';
import { CloudConfig } from 'sharedTypes';
import { appCloudConfigPath, fileOrDirExists } from '../../util';

type ReadCloudCredentials = () => Promise<CloudConfig>;

const readCloudCredentials: ReadCloudCredentials = async () => {
  const cloudConfigPath = appCloudConfigPath();

  if (fileOrDirExists(cloudConfigPath)) {
    unlinkSync(cloudConfigPath);
  }

  const cloudConfigBuffer = readFileSync(cloudConfigPath);

  try {
    const cloudConfigString = cloudConfigBuffer.toString();
    const cloudConfig: CloudConfig = JSON.parse(cloudConfigString);
    return cloudConfig;
  } catch (err) {
    throw new Error(`Error cloud config file: ${err}`);
  }
};

export default readCloudCredentials;
