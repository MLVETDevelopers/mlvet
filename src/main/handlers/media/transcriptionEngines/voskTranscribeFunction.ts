import { MapCallback, PartialWord } from 'sharedTypes';
import path from 'path';
import { getAudioExtractPath } from '../../../util';
import { TranscriptionFunction } from '../transcribeTypes';
import getVoskTranscript from '../../misc/getVoskTranscript';

interface VoskWord {
  end: number;
  start: number;
  word: string;
}

const voskAdaptor: MapCallback<VoskWord, PartialWord> = (result) => ({
  word: result.word,
  duration: result.end - result.start,
  startTime: result.start,
});
const voskTranscribeFunction: TranscriptionFunction = async (project) => {
  const modelName = 'vosk-model-en-us-0.22';
  const modelPath: string = path.join(
    __dirname,
    `../../../../voskModel/${modelName}`
  );

  const filePath: string = getAudioExtractPath(project.id);
  const jsonTranscript = JSON.parse(
    (await getVoskTranscript(modelPath, filePath)) as string
  );
  jsonTranscript.words = jsonTranscript.alternatives[0].result.map(voskAdaptor);

  return jsonTranscript;
};

export default voskTranscribeFunction;
