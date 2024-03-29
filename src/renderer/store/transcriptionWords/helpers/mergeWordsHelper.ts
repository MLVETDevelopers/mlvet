/* eslint-disable import/prefer-default-export */

import { mean } from 'renderer/utils/list';
import { bufferedWordDuration } from '../../../../sharedUtils';
import { IndexRange, Word } from '../../../../sharedTypes';
import { isMergeSplitAllowed } from '../../selection/helpers';

/**
 * Merges words in a range into a single word
 */
export const mergeWords: (words: Word[], range: IndexRange) => Word[] = (
  words,
  range
) => {
  const prefix = words.slice(0, range.startIndex);
  const wordsToMerge = words.slice(range.startIndex, range.endIndex);
  const suffix = words.slice(range.endIndex);

  const firstWord = words[range.startIndex];
  const lastWord = words[range.endIndex - 1];

  // Sanity check
  if (!isMergeSplitAllowed(words, range).merge) {
    return words;
  }

  // Resulting text of the merged words
  const mergedText = wordsToMerge
    .filter((word) => word.word !== null)
    .map((word) => word.word)
    .join(' ');

  // Combined inner durations of all the inner words
  const innerDuration = wordsToMerge.reduce((durationSoFar, word, index) => {
    const isFirst = index === 0;
    const isLast = index === wordsToMerge.length - 1;

    if (isFirst) {
      return durationSoFar + word.bufferDurationAfter + word.duration;
    }
    if (isLast) {
      return durationSoFar + word.bufferDurationBefore + word.duration;
    }
    // word in the middle
    return durationSoFar + bufferedWordDuration(word);
  }, 0);

  const mergedWord: Word = {
    ...firstWord,
    word: mergedText,
    duration: innerDuration,
    bufferDurationBefore: firstWord.bufferDurationBefore,
    bufferDurationAfter: lastWord.bufferDurationAfter,
    confidence: mean(wordsToMerge.map((word) => word.confidence ?? 1)),
  };

  return [...prefix, mergedWord, ...suffix];
};
