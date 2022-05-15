import path from 'path';
import fs from 'fs';
import { io } from 'socket.io-client';
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

const transcribeRequest: () => Promise<string> = async () => {
  const socket = io('http://localhost:5000');
  return new Promise((resolve) => {
    socket.emit(
      'transcribe',
      'audio/2830-3980-0043.wav',
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

const handleTranscription: (
  project: Project
) => Promise<Transcription | null> = async (project: Project) => {
  // TODO: replace hard coded media path with parameter passed in

  const transcript = await transcribeRequest();
  const jsonTranscript = JSON.parse(transcript);
  console.assert(jsonTranscript.transcripts.length === 1); // TODO: add more error handling here

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

export default handleTranscription;
