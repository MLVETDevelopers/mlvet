import { TranscriptionConfig } from 'sharedTypes';

// eslint-disable-next-line import/prefer-default-export
export const initTranscriptionConfig: TranscriptionConfig = {
  defaultEngine: null,
  ASSEMBLYAI: {
    key: null,
  },
  VOSK: {
    assetPath: null,
  },
  DUMMY: null,
};
