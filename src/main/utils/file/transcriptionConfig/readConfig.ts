import { readFileSync } from 'fs';
import { TranscriptionConfig } from '../../../../sharedTypes';
import { appTranscriptionConfigPath, fileOrDirExists } from '../../../util';
import { TranscriptionConfigError } from './helpers';

type ReadTranscriptionConfig = () => Promise<TranscriptionConfig | null>;

const readTranscriptionConfig: ReadTranscriptionConfig = async () => {
  const configPath = appTranscriptionConfigPath();

  if (fileOrDirExists(appTranscriptionConfigPath())) {
    const configBuffer = readFileSync(configPath);
    try {
      const configString = configBuffer.toString();
      const config: TranscriptionConfig = JSON.parse(configString);
      return config;
    } catch (err) {
      throw new TranscriptionConfigError(
        `Error reading transcription config: ${err}`
      );
    }
  }
  return null;
};

export default readTranscriptionConfig;
