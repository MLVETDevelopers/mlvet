import path from 'path';
import { TranscriptionConfig } from 'sharedTypes';
import { appDataStoragePath } from '../../../util';

// eslint-disable-next-line import/prefer-default-export
export const initTranscriptionConfig: TranscriptionConfig = {
  defaultEngine: null,
  ASSEMBLYAI: {
    key: null,
  },
  VOSK: {
    libsPath: null,
    modelPath: null,
  },
  DUMMY: null,
};

interface LocalTranscriptionAssetsDirs {
  modelDir: string;
  libsDir: string;
}

interface LocalTranscriptionAssetsPaths {
  modelPath: string;
  libsPath: string;
}

export class TranscriptionConfigError extends Error {}

export const appDefaultLocalTranscriptionAssetsBasePath: () => string = () =>
  path.join(appDataStoragePath(), 'localTranscriptionAssets');

export const appDefaultLocalTranscriptionAssetsDirs: () => LocalTranscriptionAssetsDirs =
  () => ({
    modelDir: path.join(appDefaultLocalTranscriptionAssetsBasePath(), 'model'),
    libsDir: path.join(appDefaultLocalTranscriptionAssetsBasePath(), 'libs'),
  });

export const appDefaultLocalTranscriptionAssetsPaths: () => LocalTranscriptionAssetsPaths =
  () => {
    const { modelDir, libsDir } = appDefaultLocalTranscriptionAssetsDirs();
    return {
      modelPath: path.join(modelDir, 'model'),
      libsPath: path.join(libsDir, 'libs'),
    };
  };
