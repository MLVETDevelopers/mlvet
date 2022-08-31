import { unlinkSync, writeFileSync } from 'fs';
import { appCloudConfigPath, fileOrDirExists } from '../../util';

type StoreCloudCredentials = (data: string) => Promise<void>;

const storeCloudCredentials: StoreCloudCredentials = async (data: string) => {
  const cloudConfigPath = appCloudConfigPath();

  if (fileOrDirExists(cloudConfigPath)) {
    unlinkSync(cloudConfigPath);
  }

  writeFileSync(cloudConfigPath, data);
};

export default storeCloudCredentials;
