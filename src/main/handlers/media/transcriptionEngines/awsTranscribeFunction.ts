import { MapCallback, PartialWord } from 'sharedTypes';
import { getAudioExtractPath } from '../../../util';
import { TranscriptionFunction } from '../transcribeTypes';
import getObject from '../../misc/AWS/getTranscription';
import uploadFile from '../../misc/AWS/uploadFile';
import createTranscription from '../../misc/AWS/createTranscription';

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
  const file: string = getAudioExtractPath(project.id);
  const bucket = 'fit3170';
  const transcriptionName = 'mlvet_test2.json.json';

  await uploadFile(bucket, file);
  // await createTranscription(bucket, transcriptionName);
  const rawTranscript = await getObject(bucket, transcriptionName);
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
  return jsonTranscript;
};

export default awsTranscribeFunction;
