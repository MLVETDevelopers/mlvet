/* eslint-disable import/prefer-default-export */

import { assert } from 'renderer/util';
import { Word } from '../../../sharedTypes';

/**
 * Splits a word into multiple words
 */
export const splitWord: (words: Word[], wordIndex: number) => Word[] = (
  words,
  wordIndex
) => {
  const prefix = words.slice(0, wordIndex);
  const suffix = words.slice(wordIndex + 1);

  const wordToSplit = words[wordIndex];

  // Sanity checks
  assert(!wordToSplit.deleted);

  const splitWordsText = wordToSplit.word.split(' ');

  // Evenly split the duration of the word
  const splitDuration = wordToSplit.duration / splitWordsText.length;

  const splitWords: Word[] = splitWordsText.map((text, index) => {
    const isFirst = index === 0;
    const isLast = index === splitWordsText.length;

    const startTime = wordToSplit.startTime + splitDuration * index;

    return {
      ...wordToSplit,
      bufferDurationBefore: isFirst ? wordToSplit.bufferDurationBefore : 0,
      bufferDurationAfter: isLast ? wordToSplit.bufferDurationAfter : 0,
      duration: splitDuration,
      startTime,
      word: text,
    };
  });

  return [...prefix, ...splitWords, ...suffix];
};
