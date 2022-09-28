/* eslint-disable import/prefer-default-export */

import { rangeLengthOne } from '../../../utils/range';
import { Word } from '../../../../sharedTypes';
import { isMergeSplitAllowed } from '../../selection/helpers';

/**
 * Splits a word into multiple words, returning the new word list
 */
export const splitWord: (words: Word[], wordIndex: number) => Word[] = (
  words,
  wordIndex
) => {
  const prefix = words.slice(0, wordIndex);
  const suffix = words.slice(wordIndex + 1);

  const wordToSplit = words[wordIndex];

  // Sanity check
  if (!isMergeSplitAllowed(words, [rangeLengthOne(wordIndex)]).split) {
    return words;
  }

  const splitWordsText = wordToSplit.word.split(' ');

  // Evenly split the duration of the word
  const splitDuration = wordToSplit.duration / splitWordsText.length;

  // Split words need a paste key - if this interferes with other editor logic later
  // then feel free to refactor to use a different key type ('split key'?)
  const highestExistingPasteKey = Math.max(
    0,
    ...words.map((word) => word.pasteKey)
  );

  const splitWords: Word[] = splitWordsText.map((text, index) => {
    const isFirst = index === 0;
    const isLast = index === splitWordsText.length - 1;

    const startTime = wordToSplit.startTime + splitDuration * index;

    return {
      ...wordToSplit,
      bufferDurationBefore: isFirst ? wordToSplit.bufferDurationBefore : 0,
      bufferDurationAfter: isLast ? wordToSplit.bufferDurationAfter : 0,
      duration: splitDuration,
      startTime,
      word: text,
      pasteKey: highestExistingPasteKey + index + 1,
      confidence: wordToSplit.confidence,
    };
  });

  return [...prefix, ...splitWords, ...suffix];
};
