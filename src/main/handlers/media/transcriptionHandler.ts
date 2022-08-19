import path from 'path';
import fs from 'fs';
import { io } from 'socket.io-client';
import ffmpeg from 'fluent-ffmpeg';
import {
  MapCallback,
  PartialWord,
  RuntimeProject,
  Transcription,
} from '../../../sharedTypes';
import { ffmpegPath, ffprobePath } from '../../ffUtils';
import preProcessTranscript from '../../editDelete/preProcess';
import {
  JSONTranscription,
  SnakeCaseWord,
  TranscriptionFunction,
  VoskWord,
} from '../../types';
import { USE_DUMMY } from '../../config';
import { getAudioExtractPath } from '../../util';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

interface JSONTranscriptionContainer {
  transcripts: JSONTranscription[];
}

const camelCase: MapCallback<SnakeCaseWord, PartialWord> = (word) => ({
  word: word.word,
  duration: word.duration,
  startTime: word.start_time,
});

const dummyTranscribeRequest: TranscriptionFunction = async () => {
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
    typeof word.startTime === 'number')
);

const validateJsonTranscription = <
  (transcription: any) => transcription is JSONTranscription
>((transcription) =>
  typeof transcription.confidence === 'number' &&
  Array.isArray(transcription.words) &&
  transcription.words.every(validateWord));

type GetAudioDurationInSeconds = (
  audioFilePath: string
) => Promise<number | undefined>;

const getAudioDurationInSeconds: GetAudioDurationInSeconds = async (
  audioFilePath
) => {
  return new Promise((resolve) => {
    ffmpeg.ffprobe(audioFilePath, (_, metadata) => {
      resolve(metadata.format.duration);
    });
  });
};

type RequestTranscription = (
  project: RuntimeProject
) => Promise<Transcription | null>;

const requestTranscription: RequestTranscription = async (project) => {
  if (project.mediaFilePath == null) {
    return null;
  }

  const transcript = await voskTranscribeRequest(project);

  if (!validateJsonTranscription(transcript)) {
    throw new Error('JSON transcript is invalid');
  }

  const duration: number =
    (await getAudioDurationInSeconds(getAudioExtractPath(project.id))) || 0;

  const fileName = path.basename(project.mediaFilePath);

  const processedTranscript = preProcessTranscript(
    transcript,
    duration,
    fileName
  );

  return processedTranscript;
};

export default requestTranscription;
