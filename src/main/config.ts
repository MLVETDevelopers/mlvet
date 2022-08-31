/* eslint-disable import/prefer-default-export */

import { TranscriptionEngine } from '../sharedTypes';
import readDefaultEngineConfig from './handlers/file/readDefaultEngineConfig';

// Which transcription engine to use for any transcription.
// This will eventually be replaced with a config file allowing the user to choose which engine they want

export const TRANSCRIPTION_ENGINE = TranscriptionEngine.ASSEMBLYAI;

export const DEFAULT_ENGINE_CONFIG = readDefaultEngineConfig().then(
  (engineConfig) => {
    return engineConfig ?? '';
  }
);
