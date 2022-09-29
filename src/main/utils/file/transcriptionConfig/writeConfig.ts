import { unlinkSync, writeFileSync } from 'fs';
import { TranscriptionConfig } from '../../../../sharedTypes';
import { appTranscriptionConfigPath, fileOrDirExists } from '../../../util';

type WriteTranscriptionConfig = (config: TranscriptionConfig) => void;

const writeTranscriptionConfig: WriteTranscriptionConfig = (config) => {
  const configPath = appTranscriptionConfigPath();
  if (fileOrDirExists(configPath)) {
    unlinkSync(configPath);
  }
  writeFileSync(configPath, JSON.stringify(config));
};

export default writeTranscriptionConfig;
