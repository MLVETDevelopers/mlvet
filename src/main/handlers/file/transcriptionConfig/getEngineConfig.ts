import { EngineConfig, TranscriptionEngine } from '../../../../sharedTypes';
import getTranscriptionConfigDefault from './getConfig';

type GetTranscriptionEngineConfig = (
  engine: TranscriptionEngine
) => Promise<EngineConfig | null>;

const getTranscriptionEngineConfig: GetTranscriptionEngineConfig = async (
  engine
) => {
  const config = await getTranscriptionConfigDefault();
  return config[engine];
};

export default getTranscriptionEngineConfig;
