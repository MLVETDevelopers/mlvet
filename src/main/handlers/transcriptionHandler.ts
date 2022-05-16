import path from 'path';
import fs from 'fs';
import { app } from 'electron';
import getAudioDurationInSeconds from 'get-audio-duration';
import { Project, Transcription } from '../../sharedTypes';
import preProcessTranscript from '../editDelete/preProcess';
import { JSONTranscription, SnakeCaseWord } from '../types';

interface JSONTranscriptionContainer {
  transcripts: JSONTranscription[];
}

/**
 * util to simulate running of transcription
 * @param n seconds to sleep
 * @returns promise resolving after n seconds
 */
const sleep: (n: number) => Promise<void> = (n) =>
  new Promise((resolve) => setTimeout(resolve, n * 1000));

/**
 * This is an easy (but kind of annoying) approach to validating incoming JSON.
 * The idea is that we only have types at compile time, but we need to validate at
 * runtime. Other solutions include:
 * 1. Just trust that the JSON is valid, and cast it
 * 2. More advanced solutions that generate runtime checks based off typescript types
 * (e.g. https://github.com/YousefED/typescript-json-schema)
 */

const validateWord = <(word: any) => word is SnakeCaseWord>(
  ((word) =>
    typeof word.word === 'string' &&
    typeof word.duration === 'number' &&
    typeof word.start_time === 'number')
);

const validateJsonTranscription = <
  (transcription: any) => transcription is JSONTranscription
>((transcription) =>
  typeof transcription.confidence === 'number' &&
  Array.isArray(transcription.words) &&
  transcription.words.every(validateWord));

const validateJsonTranscriptionContainer = <
  (transcription: any) => transcription is JSONTranscriptionContainer
>((transcription) =>
  Array.isArray(transcription.transcripts) &&
  transcription.transcripts.length === 1 &&
  validateJsonTranscription(transcription.transcripts[0]));

type RequestTranscription = (project: Project) => Promise<Transcription | null>;

const requestTranscription: RequestTranscription = async (project) => {
  // TODO: replace hard coded media path with parameter passed in

  if (project.audioExtractFilePath == null || project.mediaFilePath == null) {
    return null;
  }

  await sleep(3); // Sleep to simulate transcription time. Remove this when real transcription is added

  // Read from sample transcript. Replace this section with real transcript input
  const transcriptionPath = app.isPackaged
    ? path.join(process.resourcesPath, 'assets/SampleTranscript.json')
    : path.join(__dirname, '../../../assets/SampleTranscript.json');

  const rawTranscription = fs.readFileSync(transcriptionPath).toString();
  const jsonTranscript = JSON.parse(rawTranscription);

  if (!validateJsonTranscriptionContainer(jsonTranscript)) {
    throw new Error('JSON transcript is invalid');
  }

  const duration: number =
    (await getAudioDurationInSeconds(project.audioExtractFilePath)) || 0;
  const fileName = path.basename(project.mediaFilePath);
  const processedTranscript = preProcessTranscript(
    jsonTranscript.transcripts[0],
    duration,
    fileName
  );

  return processedTranscript;
};

export default requestTranscription;
