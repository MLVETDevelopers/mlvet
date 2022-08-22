import { io } from 'socket.io-client';
import { getAudioExtractPath } from '../../../util';
import { TranscriptionFunction } from '../transcribeTypes';
import camelCase from './shared/transcribeFunctionSharedUtils';

const deepspeechTranscribeFunction: TranscriptionFunction = async (project) => {
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

export default deepspeechTranscribeFunction;
