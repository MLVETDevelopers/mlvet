import { appCloudConfigPath, fileOrDirExists } from 'main/util';
import { unlinkSync, writeFileSync } from 'fs';

type StoreCloudCredentials = (data: string) => Promise<void>;

const storeCloudCredentials: StoreCloudCredentials = async (data: string) => {
  const cloudConfigPath = appCloudConfigPath();

  if (fileOrDirExists(cloudConfigPath)) {
    unlinkSync(cloudConfigPath);
  }

  writeFileSync(cloudConfigPath, data);
};

export default storeCloudCredentials;
