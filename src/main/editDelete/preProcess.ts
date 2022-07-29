import { v4 as uuidv4 } from 'uuid';
import { roundToMs } from '../util';
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

const constructWord: (
  word: string,
  startTime: number,
  duration: number,
  outputStartTime: number,
  fileName: string
) => Word = (word, startTime, duration, outputStartTime, fileName) => ({
  word,
  startTime: roundToMs(startTime),
  duration: roundToMs(duration),
  outputStartTime: roundToMs(outputStartTime),
  deleted: false,
  key: uuidv4(),
  fileName,
});

/**
 * Adds spaces between words which represent the silence between each word
 * @param result The output being constructed
 * @param word The current element of words
 * @param index The index of word in words
 * @param words The list of words being reduced
 * @returns The updated transcript with a silence after word
 */
const addSpaces: (totalDuration: number) => MapCallback<Word, Word[]> =
  (totalDuration: number) => (word, index, words) => {
    const SPACE_CHAR = ' ';
    const wordAndSilence: Word[] = [];
    const { fileName } = word;

    // is the first word
    if (index === 0) {
      wordAndSilence.push(
        constructWord(SPACE_CHAR, 0, words[index].startTime, 0, fileName)
      );
    }

    const isLastWord = index === words.length - 1;
    const endTime = isLastWord ? totalDuration : words[index + 1].startTime;
    const silenceDuration = endTime - word.startTime - word.duration;

    wordAndSilence.push(word);
    wordAndSilence.push(
      constructWord(
        SPACE_CHAR,
        word.startTime + word.duration,
        silenceDuration,
        word.startTime + word.duration,
        fileName
      )
    );

    return wordAndSilence;
  };

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
  };
};

export default preProcessTranscript;
