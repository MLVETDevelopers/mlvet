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
  VOSK: null,
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
    case TranscriptionEngine.VOSK: {
      return {
        ...cloudConfig,
        defaultEngine,
        VOSK: engineConfigs,
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

        writeFileSync(cloudConfigPath, JSON.stringify(updatedCloudConfig));

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

    writeFileSync(cloudConfigPath, JSON.stringify(newCloudConfig));
  }
};

export default storeCloudCredentials;
