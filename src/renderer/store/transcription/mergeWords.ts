/* eslint-disable import/prefer-default-export */

import { assert, isInOriginalOrder } from 'renderer/util';
import { bufferedWordDuration } from '../../../sharedUtils';
import { IndexRange, Word } from '../../../sharedTypes';

/**
 * Merges words in a range into a single word
 */
export const mergeWords: (words: Word[], range: IndexRange) => Word[] = (
  words,
  range
) => {
  const prefix = words.slice(0, range.startIndex);
  const suffix = words.slice(range.endIndex);

  const firstWord = words[range.startIndex];
  const lastWord = words[range.endIndex - 1];

  const wordsToMerge = words.slice(range.startIndex, range.endIndex);

  // Basic assertions to sanity check usage
  assert(wordsToMerge.length > 1, 'must select at least two words to merge');
  assert(
    wordsToMerge.every((word) => !word.deleted),
    "can't merge deleted words"
  );
  assert(isInOriginalOrder(words, range), 'words must be in original order');
  assert(
    wordsToMerge.every((word) => word.fileName === firstWord.fileName),
    'words must be from the same media'
  );

  // Resulting text of the merged words
  const mergedText = wordsToMerge.map((word) => word.word).join(' ');

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
  };

  return [...prefix, mergedWord, ...suffix];
};
