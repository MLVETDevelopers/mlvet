import { v4 as uuidv4 } from 'uuid';
import { addSpaces } from '../../processingShared';
import { MapCallback, Transcription, Word } from '../../sharedTypes';
import { JSONTranscription, SnakeCaseWord } from '../types';
import punctuate from './punctuate';

type PartialWord = Pick<Word, 'word' | 'startTime' | 'duration'>;

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

/**
 * Injects extra attributes into a PartialWord to make it a full Word
 */
const injectAttributes: (fileName: string) => MapCallback<PartialWord, Word> =
  (fileName: string) => (word) => ({
    ...word,
    outputStartTime: word.startTime,
    key: uuidv4(), // universally unique key
    deleted: false,
    fileName,
  });

const calculateAverageSilenceDuration = (
  jsonTranscription: JSONTranscription,
  totalDuration: number
): number => {
  let silenceSum = 0;
  for (let i = 0; i < jsonTranscription.words.length - 1; i += 1) {
    const endTime = jsonTranscription.words[i + 1].start_time;
    const silenceDuration =
      endTime -
      jsonTranscription.words[i].start_time -
      jsonTranscription.words[i].duration;
    silenceSum += silenceDuration;
  }
  return jsonTranscription.words.length !== 0
    ? silenceSum / jsonTranscription.words.length
    : totalDuration;
};

/**
 * Pre processes a JSON transcript from python for use in the front end
 * @param jsonTranscript the JSON transcript input (technically a JS object but with some fields missing)
 * @param duration duration of the input media file
 * @returns formatted Transcript object
 */
const preProcessTranscript = (
  jsonTranscript: JSONTranscription,
  duration: number,
  fileName: string
): Transcription => {
  const averageSilenceDuration: number = calculateAverageSilenceDuration(
    jsonTranscript,
    duration
  );

  return {
    confidence: jsonTranscript.confidence,
    words: jsonTranscript.words
      .map(camelCase)
      .map(punctuate(duration, averageSilenceDuration))
      .map(injectAttributes(fileName))
      .map(addSpaces(duration))
      .flat(),
    duration,
  };
};

export default preProcessTranscript;
