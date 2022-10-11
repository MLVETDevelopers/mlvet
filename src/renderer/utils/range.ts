import { clamp } from 'main/timeUtils';
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

export const isIndexInRanges: (
  ranges: IndexRange[],
  index: number
) => boolean = (ranges, index) =>
  ranges.some((range) => isIndexInRange(range, index));

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
 * Clamps a range within specified bounds.
 * `startIndex` is bounded at the maximum by one extra unit as `max` specifies
 * an end-exclusive maximum.
 */
export const clampRange: (
  range: IndexRange,
  min: number,
  max: number
) => IndexRange = (range, min, max) => ({
  startIndex: clamp(range.startIndex, min, max - 1),
  endIndex: clamp(range.endIndex, min, max),
});

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
