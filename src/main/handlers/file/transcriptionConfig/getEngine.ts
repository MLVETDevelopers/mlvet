import { TranscriptionEngine } from '../../../../sharedTypes';
import getTranscriptionConfigDefault from './getConfig';

type GetTranscriptionEngine = () => Promise<TranscriptionEngine | null>;

const getTranscriptionEngine: GetTranscriptionEngine = async () => {
  const config = await getTranscriptionConfigDefault();
  return config.defaultEngine;
};

export default getTranscriptionEngine;
