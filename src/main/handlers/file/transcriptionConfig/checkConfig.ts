import {
  CloudConfig,
  LocalConfig,
  TranscriptionEngine,
} from '../../../../sharedTypes';
import {
  areCloudConfigRequirementsMet,
  areLocalConfigRequirementsMet,
} from '../../../utils/file/transcriptionConfig/checkConfig';
import getTranscriptionConfigDefault from './getConfig';

const engineConfigCheckFunctions = {
  [TranscriptionEngine.DUMMY]: () => true,
  [TranscriptionEngine.ASSEMBLYAI]: areCloudConfigRequirementsMet,
  [TranscriptionEngine.VOSK]: areLocalConfigRequirementsMet,
};

type AreEngineConfigRequirementsMet = () => Promise<boolean>;

const areEngineConfigRequirementsMet: AreEngineConfigRequirementsMet =
  async () => {
    const config = await getTranscriptionConfigDefault();
    const { defaultEngine } = config;
    return (
      defaultEngine !== null &&
      engineConfigCheckFunctions[defaultEngine](
        config[defaultEngine] as CloudConfig & LocalConfig
      )
    );
  };

export default areEngineConfigRequirementsMet;
