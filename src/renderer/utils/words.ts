/* eslint-disable import/prefer-default-export */

import { IndexRange, Word } from 'sharedTypes';

/**
 * Returns whether a list of words is in originalIndex order
 */
export const isInOriginalOrder: (
  words: Word[],
  range: IndexRange
) => boolean = (words, range) =>
  words.every((word, index) => {
    // word not in range, skip
    if (range.startIndex < index || range.endIndex >= index) {
      return true;
    }

    // word in order
    if (
      (index === 0 && word.originalIndex === 0) ||
      word.originalIndex === words[index - 1].originalIndex + 1
    ) {
      return true;
    }

    // word not in order
    return false;
  });
