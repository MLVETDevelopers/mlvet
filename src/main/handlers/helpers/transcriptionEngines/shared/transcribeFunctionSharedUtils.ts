import { MapCallback, PartialWord } from 'sharedTypes';

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
export default camelCase;
