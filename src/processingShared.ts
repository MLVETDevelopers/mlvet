import { MapCallback, Word } from 'sharedTypes';
import { v4 as uuidv4 } from 'uuid';
import { roundToMs } from './sharedUtils';

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

export const SPACE_CHAR = ' ';

/**
 * Adds spaces between words which represent the silence between each word
 * @param result The output being constructed
 * @param word The current element of words
 * @param index The index of word in words
 * @param words The list of words being reduced
 * @returns The updated transcript with a silence after word
 */
export const addSpaces: (totalDuration: number) => MapCallback<Word, Word[]> =
  (totalDuration: number) => (word, index, words) => {
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
