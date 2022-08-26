import { MapCallback, PartialWord } from 'sharedTypes';
import fs from 'fs';
import path from 'path';
import { TranscriptionFunction } from '../transcribeTypes';

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
  const rawTranscript = fs
    .readFileSync(
      path.join(__dirname, '../../../../../../assets/SampleTranscriptVosk.json')
    )
    .toString();
  const jsonTranscript = JSON.parse(rawTranscript).alternatives[0];
  jsonTranscript.words = jsonTranscript.result.map(voskAdaptor);
  return jsonTranscript;
};

export default voskTranscribeFunction;
