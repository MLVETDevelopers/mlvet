import { MapCallback, PartialWord } from 'sharedTypes';
import fs from 'fs';
import path from 'path';
import { TranscriptionFunction } from '../transcribeTypes';

interface AwsWord {
  start_time: number;
  end_time: number;
  word: string;
}

const awsAdaptor: MapCallback<AwsWord, PartialWord> = (result) => ({
  word: result.word,
  duration: result.end_time - result.start_time,
  startTime: result.start_time,
});
const awsTranscribeFunction: TranscriptionFunction = async (project) => {
  const rawTranscript = fs
    .readFileSync(
      path.join(__dirname, '../../../../../assets/SampleTranscriptAWS.json')
    )
    .toString();

  const transcriptionWords = JSON.parse(rawTranscript).results.items;
  for (let i = 0; i < transcriptionWords.length; i += 1) {
    // jsonTranscript[i].word = jsonTranscript.alternatives[0].content;
    transcriptionWords[i].word = transcriptionWords[i].alternatives[0].content;
    delete transcriptionWords[i].alternatives;
    transcriptionWords[i].start_time = Number(transcriptionWords[i].start_time);
    transcriptionWords[i].end_time = Number(transcriptionWords[i].end_time);
    if (transcriptionWords[i].type === 'punctuation') {
      transcriptionWords[i].start_time = transcriptionWords[i - 1].end_time;
      transcriptionWords[i].end_time = transcriptionWords[i - 1].end_time;
    }
    delete transcriptionWords[i].type;
  }

  const jsonTranscript: any = {
    confidence: 5000,
    result: [],
    text: 'test',
  };
  jsonTranscript.result = transcriptionWords;
  jsonTranscript.words = jsonTranscript.result.map(awsAdaptor);
  console.log(jsonTranscript);
  return jsonTranscript;
};

export default awsTranscribeFunction;
