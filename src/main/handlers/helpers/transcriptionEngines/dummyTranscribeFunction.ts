import path from 'path';
import fs from 'fs';
import { PartialWord } from 'sharedTypes';
import { TranscriptionFunction } from '../transcribeTypes';
import camelCase from './shared/transcribeFunctionSharedUtils';

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
      path.join(__dirname, '../../../../../assets/SampleTranscript.json')
    )
    .toString();
  const jsonTranscript = JSON.parse(rawTranscript).transcripts[0];
  jsonTranscript.words = jsonTranscript.words.map(camelCase);
  jsonTranscript.words = jsonTranscript.words.map((word: PartialWord) => ({
    ...word,
    confidence: 1,
  }));
  return jsonTranscript;
};

export default dummyTranscribeFunction;
