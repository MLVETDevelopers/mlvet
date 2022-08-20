import path from 'path';
import { MapCallback, PartialWord, RuntimeProject } from 'sharedTypes';
import { io } from 'socket.io-client';
import fs from 'fs';
import { JSONTranscription } from '../../types';
import { getAudioExtractPath } from '../../util';

interface SnakeCaseWord {
  word: string;
  duration: number;
  start_time: number; // TODO: change this to camel case before it touches TS
}

interface VoskWord {
  end: number;
  start: number;
  word: string;
}
export enum TranscriptionEngine {
  DUMMY,
  VOSK,
  DEEPSPEECH,
}
const voskAdaptor: MapCallback<VoskWord, PartialWord> = (result) => ({
  word: result.word,
  duration: result.end - result.start,
  startTime: result.start,
});
const voskTranscribeRequest: TranscriptionFunction = async (project) => {
  const rawTranscript = fs
    .readFileSync(
      path.join(__dirname, '../../../../assets/SampleTranscriptVosk.json')
    )
    .toString();
  const jsonTranscript = JSON.parse(rawTranscript).alternatives[0];
  jsonTranscript.words = jsonTranscript.result.map(voskAdaptor);
  return jsonTranscript;
};
const camelCase: MapCallback<SnakeCaseWord, PartialWord> = (word) => ({
  word: word.word,
  duration: word.duration,
  startTime: word.start_time,
});

const dummyTranscribeRequest: TranscriptionFunction = async () => {
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

const deepspeechTranscribeRequest: TranscriptionFunction = async (project) => {
  const socket = io(`http://localhost:${process.env.FLASK_PORT}`);
  const deepspeechPromise = new Promise((resolve) => {
    socket.emit(
      'transcribe',
      getAudioExtractPath(project.id),
      (transcription: string) => {
        resolve(transcription);
      }
    );
  });
  const jsonTranscript = JSON.parse((await deepspeechPromise) as string)
    .transcripts[0];
  jsonTranscript.words = jsonTranscript.words.map(camelCase);
  return jsonTranscript;
};

type TranscriptionFunction = (
  project: RuntimeProject
) => Promise<JSONTranscription>;

const getTranscriptionFunction = new Map<
  TranscriptionEngine,
  TranscriptionFunction
>();
getTranscriptionFunction.set(TranscriptionEngine.VOSK, voskTranscribeRequest);
getTranscriptionFunction.set(
  TranscriptionEngine.DEEPSPEECH,
  deepspeechTranscribeRequest
);
getTranscriptionFunction.set(TranscriptionEngine.DUMMY, dummyTranscribeRequest);

export const transcribe = async (
  project: RuntimeProject,
  transcriptionEngine: TranscriptionEngine
) => {
  const transcriptionFunction =
    getTranscriptionFunction.get(transcriptionEngine) ?? dummyTranscribeRequest;
  return transcriptionFunction(project);
};
