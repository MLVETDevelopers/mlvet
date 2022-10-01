import writeTranscriptionConfig from '../../../utils/file/transcriptionConfig/writeConfig';
import {
  EngineConfig,
  TranscriptionConfig,
  TranscriptionEngine,
} from '../../../../sharedTypes';
import getTranscriptionConfigDefault from './getConfig';

const updateEngineConfig = (
  transcriptionConfig: TranscriptionConfig,
  engine: TranscriptionEngine,
  engineConfig: EngineConfig
) => {
  return {
    ...transcriptionConfig,
    [engine]: engineConfig,
  };
};

type SetTranscriptionEngineConfig = (
  engine: TranscriptionEngine,
  engineConfig: EngineConfig
) => Promise<void>;

const setTranscriptionEngineConfig: SetTranscriptionEngineConfig = async (
  engine,
  engineConfig
) => {
  const config = await getTranscriptionConfigDefault();
  const newConfig = updateEngineConfig(config, engine, engineConfig);
  writeTranscriptionConfig(newConfig);
};

export default setTranscriptionEngineConfig;
