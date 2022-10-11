import readTranscriptionConfig from '../../../utils/file/transcriptionConfig/readConfig';
import { TranscriptionConfig } from '../../../../sharedTypes';
import { initTranscriptionConfig } from '../../../utils/file/transcriptionConfig/helpers';

type GetTranscriptionConfigDefault = () => Promise<TranscriptionConfig>;

const getTranscriptionConfigDefault: GetTranscriptionConfigDefault =
  async () => {
    const config = await readTranscriptionConfig();
    return config !== null ? config : initTranscriptionConfig;
  };

export default getTranscriptionConfigDefault;
