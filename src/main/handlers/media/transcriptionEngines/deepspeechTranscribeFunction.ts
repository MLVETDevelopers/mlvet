import { MapCallback, PartialWord } from 'sharedTypes';
import { io } from 'socket.io-client';
import { getAudioExtractPath } from '../../../util';
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
