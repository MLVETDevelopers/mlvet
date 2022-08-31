import { unlinkSync, writeFileSync } from 'fs';
import { CloudConfig, EngineConfig, TranscriptionEngine } from 'sharedTypes';
import { appCloudConfigPath, fileOrDirExists } from '../../util';
import readCloudCredentials from './readCloudCredentials';

type StoreCloudCredentials = (
  defaultEngine: TranscriptionEngine,
  engineConfigs: EngineConfig
) => Promise<void>;

const storeCloudCredentials: StoreCloudCredentials = async (
  defaultEngine: TranscriptionEngine,
  engineConfigs: EngineConfig
) => {
  const cloudConfigPath = appCloudConfigPath();

  if (fileOrDirExists(cloudConfigPath)) {
    readCloudCredentials()
      .then((cloudConfig) => {
        unlinkSync(cloudConfigPath);

        const updatedConfig = cloudConfig.engineConfigs.set(
          defaultEngine.toString(),
          engineConfigs
        );

        writeFileSync(cloudConfigPath, JSON.stringify(updatedConfig));
        return updatedConfig;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    const newCloudConfig: CloudConfig = {
      defaultEngine,
      engineConfigs: new Map<string, EngineConfig>([
        [defaultEngine.toString(), engineConfigs],
      ]),
    };

    writeFileSync(cloudConfigPath, JSON.stringify(newCloudConfig));
  }
};

export default storeCloudCredentials;
