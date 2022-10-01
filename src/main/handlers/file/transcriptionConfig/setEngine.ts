import writeTranscriptionConfig from '../../../utils/file/transcriptionConfig/writeConfig';
import {
  TranscriptionConfig,
  TranscriptionEngine,
} from '../../../../sharedTypes';
import getTranscriptionConfigDefault from './getConfig';

const updateDefaultEngine = (
  transcriptionConfig: TranscriptionConfig,
  engine: TranscriptionEngine
) => {
  return {
    ...transcriptionConfig,
    defaultEngine: engine,
  };
};

type SetTranscriptionEngine = (engine: TranscriptionEngine) => Promise<void>;

const setTranscriptionEngine: SetTranscriptionEngine = async (engine) => {
  const config = await getTranscriptionConfigDefault();
  const newConfig = updateDefaultEngine(config, engine);
  writeTranscriptionConfig(newConfig);
};

export default setTranscriptionEngine;
