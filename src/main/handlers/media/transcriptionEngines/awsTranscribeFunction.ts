import { MapCallback, PartialWord } from 'sharedTypes';
import fs from 'fs';
import path from 'path';
import { TranscriptionFunction } from '../transcribeTypes';

interface Alternatives {
  confidence: number;
  content: string;
}

interface AwsWord {
  start_time: number;
  end_time: number;
  alternatives: Array<Alternatives>;
  type: string;
}

const awsAdaptor: MapCallback<AwsWord, PartialWord> = (result) => ({
  word: result.alternatives[0].content,
  duration: result.end_time - result.start_time,
  startTime: result.start_time,
});
const awsTranscribeFunction: TranscriptionFunction = async (project) => {
  const rawTranscript = fs
    .readFileSync(
      path.join(__dirname, '../../../../../assets/SampleTranscriptVosk.json')
    )
    .toString();
  const jsonTranscript = JSON.parse(rawTranscript).results.items[0];
  jsonTranscript.words = jsonTranscript.result.map(awsAdaptor);
  return jsonTranscript;
};

export default awsTranscribeFunction;
