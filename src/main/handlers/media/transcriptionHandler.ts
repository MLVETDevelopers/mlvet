import path from 'path';
import fs from 'fs';
import { io } from 'socket.io-client';
import getAudioDurationInSeconds from 'get-audio-duration';
import { Project, Transcription } from '../../../sharedTypes';
import preProcessTranscript from '../../editDelete/preProcess';
import { JSONTranscription, SnakeCaseWord } from '../../types';
import { USE_DUMMY } from '../../config';

interface JSONTranscriptionContainer {
  transcripts: JSONTranscription[];
}

const dummyTranscribeRequest: () => string = () => {
  return fs
    .readFileSync(
      path.join(__dirname, '../../../../assets/SampleTranscript.json')
    )
    .toString();
};

const transcribeRequest: (project: Project) => Promise<string> = async (
  project
) => {
  const socket = io(`http://localhost:${process.env.FLASK_PORT}`);
  return new Promise((resolve) => {
    socket.emit(
      'transcribe',
      project.audioExtractFilePath,
      (transcription: string) => {
        resolve(transcription);
      }
    );
  });
};

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
  if (project.audioExtractFilePath == null || project.mediaFilePath == null) {
    return null;
  }

  const transcript = USE_DUMMY
    ? dummyTranscribeRequest()
    : await transcribeRequest(project);

  const jsonTranscript = JSON.parse(transcript);

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
