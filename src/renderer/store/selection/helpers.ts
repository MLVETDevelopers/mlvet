/* eslint-disable import/prefer-default-export */
import { isInOriginalOrder } from 'renderer/util';
import { IndexRange, Word } from 'sharedTypes';

/**
 * Returns whether merge and/or split are allowed given the current state
 * of the transcription and selection
 *
 * @param words complete list of words in the transcription
 * @param ranges of currently selected words
 * @returns
 */
export const isMergeSplitAllowed: (
  words: Word[],
  ranges: IndexRange[]
) => { merge: boolean; split: boolean } = (words, ranges) => {
  if (words === undefined) {
    // No transcription, therefore can't merge / split
    return {
      merge: false,
      split: false,
    };
  }

  if (ranges.length !== 1) {
    // No selection or non contiguous selection, therefore can't merge / split
    return {
      merge: false,
      split: false,
    };
  }

  const range = ranges[0];
  const wordsToMerge = words.slice(range.startIndex, range.endIndex);
  const firstWord = words[range.startIndex];

  // Conditions
  const hasAtLeastTwoWords = wordsToMerge.length > 1;
  const noSelectedWordsDeleted = wordsToMerge.every((word) => !word.deleted);
  const inOriginalOrder = isInOriginalOrder(words, range);
  const isFromSameTranscription = wordsToMerge.every(
    (word) => word.fileName === firstWord.fileName
  );
  const isWordSplittable = firstWord.word.includes(' ');

  return {
    merge:
      hasAtLeastTwoWords &&
      noSelectedWordsDeleted &&
      inOriginalOrder &&
      isFromSameTranscription,
    split: noSelectedWordsDeleted && isWordSplittable,
  };
};
