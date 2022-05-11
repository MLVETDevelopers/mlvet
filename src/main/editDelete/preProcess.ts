import { MapCallback, roundToMs } from '../util';
import { Transcription, Word } from '../../sharedTypes';
import { JSONTranscription, SnakeCaseWord } from '../types';

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
 * Injects extra attributes into a PartialWord to make it a full Word -
 * @param word the word to fill attributes for
 * @param i index of the word in the transcript
 * @returns full Word object
 */
const injectAttributes: MapCallback<PartialWord, Word> = (word, i) => ({
  ...word,
  outputStartTime: word.startTime,
  key: i.toString(),
  deleted: false,
  fileName: 'PLACEHOLDER FILENAME',
});

const constructWord = (
  word: string,
  startTime: number,
  duration: number,
  outputStartTime: number,
  key: string
) => {
  const newWord: Word = {
    word,
    startTime: roundToMs(startTime),
    duration: roundToMs(duration),
    outputStartTime: roundToMs(outputStartTime),
    deleted: false,
    key,
    fileName: 'PLACEHOLDER FILENAME',
  };

  return newWord;
};

/**
 * Adds spaces between words which represent the silence between each word
 * @param result The output being constructed
 * @param word The current element of words
 * @param index The index of word in words
 * @param words The list of words being reduced
 * @returns The updated transcript with a silence after word
 */
let TOTAL_DURATION = 0;
const addSpaces = (
  result: Word[],
  word: Word,
  index: number,
  words: Word[]
) => {
  const spaceChar = ' ';

  // is the first word
  if (index === 0) {
    result.push(
      constructWord(spaceChar, 0, words[index].startTime, 0, index.toString())
    );
  }

  const isLastWord = index === words.length - 1;
  const endTime = isLastWord ? TOTAL_DURATION : words[index + 1].startTime;
  const silenceDuration = endTime - word.startTime - word.duration;

  word.key = (index * 2 + 1).toString();
  result.push(word);
  result.push(
    constructWord(
      spaceChar,
      word.startTime + word.duration,
      silenceDuration,
      word.startTime + word.duration,
      (index * 2 + 2).toString()
    )
  );

  return result;
};

/**
 * Pre processes a JSON transcript from python for use in the front end
 * @param jsonTranscript the JSON transcript input (technically a JS object but with some fields missing)
 * @param duration duration of the input media file
 * @returns formatted Transcript object
 */
const preProcessTranscript = (
  jsonTranscript: JSONTranscription,
  duration: number
): Transcription => {
  TOTAL_DURATION = duration;
  return {
    confidence: jsonTranscript.confidence,
    words: jsonTranscript.words
      .map(camelCase)
      .map(injectAttributes)
      .reduce(addSpaces, []),
  };
};

export default preProcessTranscript;
