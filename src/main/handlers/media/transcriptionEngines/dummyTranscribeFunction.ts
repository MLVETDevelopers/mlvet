import path from 'path';
import fs from 'fs';
import { MapCallback, PartialWord } from 'sharedTypes';
import { TranscriptionFunction } from '../transcribeTypes';

/**
 * Replace the start_time attribute with startTime (can be generalised further but shouldn't
 * need this once python outputs camelcase anyway)
 * @param word snake cased partial word
 * @returns camel cased partial word
 *
 */
const camelCase: MapCallback<SnakeCaseWord, PartialWord> = (word) => ({
  word: word.word,
  duration: word.duration,
  startTime: word.start_time,
});

interface SnakeCaseWord {
  word: string;
  duration: number;
  start_time: number; // TODO: change this to camel case before it touches TS
}

/**
 * Function to generate a dummy transcription by reading a hardcoded transcription file.
 * This function should not be called directly,
 * but instead returned from the getTranscriptionFunction.get method in transcribe.ts
 * @param word snake cased partial word
 * @returns camel cased partial word
 *
 */
const dummyTranscribeFunction: TranscriptionFunction = async () => {
  // Read in and translate a hardcoded deepspeech translation file
  const rawTranscript = fs
    .readFileSync(
      path.join(__dirname, '../../../../assets/SampleTranscript.json')
    )
    .toString();
  const jsonTranscript = JSON.parse(rawTranscript).transcripts[0];
  jsonTranscript.words = jsonTranscript.words.map(camelCase);
  return jsonTranscript;
};

export default dummyTranscribeFunction;
