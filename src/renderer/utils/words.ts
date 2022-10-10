/* eslint-disable import/prefer-default-export */

import { IndexRange, Word } from 'sharedTypes';
import { getLengthOfRange } from './range';

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

    // edge case, only one word
    if (getLengthOfRange(range) === 1 || words.length === 1) {
      return true;
    }

    const prevWordOriginalIndex =
      index === 0 ? null : words[index - 1].originalIndex;
    const nextWordOriginalIndex =
      index === words.length - 1 ? null : words[index + 1].originalIndex;

    // word in order
    if (
      (prevWordOriginalIndex !== null &&
        word.originalIndex === prevWordOriginalIndex + 1) ||
      (nextWordOriginalIndex !== null &&
        word.originalIndex === nextWordOriginalIndex - 1)
    ) {
      return true;
    }

    // word not in order
    return false;
  });

export const markWordDeleted = (word: Word) => ({ ...word, deleted: true });

export const markWordUndeleted = (word: Word) => ({ ...word, deleted: false });

export const markWordFound = (word: Word) => ({
  ...word,
  ctrlFindState: {
    searchMatch: true,
    selected: false,
  },
});

export const markWordSelected = (word: Word) => ({ ...word, selected: true });
