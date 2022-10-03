import { IndexRange, Word } from 'sharedTypes';

/**
 * Helper for making IndexRanges with a size of one, e.g. a single word
 */
export const rangeLengthOne: (index: number) => IndexRange = (index) => ({
  startIndex: index,
  endIndex: index + 1,
});

export const getLengthOfRange: (range: IndexRange) => number = (range) =>
  range.endIndex - range.startIndex;

export const isIndexInRange: (range: IndexRange, index: number) => boolean = (
  range,
  index
) => index >= range.startIndex && index < range.endIndex;

export const emptyRange: () => IndexRange = () => ({
  startIndex: 0,
  endIndex: 0,
});

export const areRangesEqual: (
  rangeOne: IndexRange,
  rangeTwo: IndexRange
) => boolean = (rangeOne, rangeTwo) =>
  rangeOne.startIndex === rangeTwo.startIndex &&
  rangeOne.endIndex === rangeTwo.endIndex;

/**
 * Takes a range and a list of the words in that range,
 * and builds a list of indices containing only the indices of
 * words in that range that are not deleted.
 */
export const excludeDeletedWords: (
  range: IndexRange,
  wordsInRange: Word[]
) => number[] = (range, wordsInRange) => {
  const indices = [];
  for (let i = range.startIndex; i < range.endIndex; i += 1) {
    if (!wordsInRange[i - range.startIndex].deleted) {
      indices.push(i);
    }
  }
  return indices;
};
