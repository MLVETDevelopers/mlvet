import path from 'path';
import fs from 'fs';
import { TranscriptionFunction } from '../transcribeTypes';

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

  const jsonTranscript = JSON.parse(rawTranscript);

  return jsonTranscript;
};

export default dummyTranscribeFunction;
