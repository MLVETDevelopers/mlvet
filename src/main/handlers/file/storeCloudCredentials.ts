import { readFileSync, unlinkSync, writeFileSync } from 'fs';
import {
  CloudConfig,
  EngineConfig,
  TranscriptionEngine,
} from '../../../sharedTypes';
import { appCloudConfigPath, fileOrDirExists } from '../../util';
import readCloudConfig from './readCloudConfig';

type StoreCloudCredentials = (
  defaultEngine: TranscriptionEngine,
  engineConfigs: EngineConfig
) => Promise<void>;

const initCloudConfig: CloudConfig = {
  defaultEngine: TranscriptionEngine.ASSEMBLYAI,
  ASSEMBLYAI: null,
  DUMMY: null,
};

const updateCloudConfig = (
  defaultEngine: TranscriptionEngine,
  engineConfigs: EngineConfig,
  cloudConfig: CloudConfig
): CloudConfig => {
  switch (defaultEngine) {
    case TranscriptionEngine.ASSEMBLYAI: {
      return {
        ...cloudConfig,
        defaultEngine,
        ASSEMBLYAI: engineConfigs,
      };
    }
    default: {
      return {
        ...cloudConfig,
        defaultEngine,
        DUMMY: engineConfigs,
      };
    }
  }
};

const storeCloudCredentials: StoreCloudCredentials = async (
  defaultEngine: TranscriptionEngine,
  engineConfigs: EngineConfig
) => {
  const cloudConfigPath = appCloudConfigPath();

  if (fileOrDirExists(cloudConfigPath)) {
    readCloudConfig()
      .then((cloudConfig) => {
        unlinkSync(cloudConfigPath);

        const updatedCloudConfig = updateCloudConfig(
          defaultEngine,
          engineConfigs,
          cloudConfig
        );

        console.log(`${JSON.stringify(updatedCloudConfig)}ready`);

        writeFileSync(cloudConfigPath, JSON.stringify(updatedCloudConfig));
        console.log(`${readFileSync(cloudConfigPath)}read`);
        return updatedCloudConfig;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    const newCloudConfig = updateCloudConfig(
      defaultEngine,
      engineConfigs,
      initCloudConfig
    );

    console.log(JSON.stringify(newCloudConfig));
    writeFileSync(cloudConfigPath, JSON.stringify(newCloudConfig));
    console.log(`${readFileSync(cloudConfigPath)}read`);
  }
};

export default storeCloudCredentials;
