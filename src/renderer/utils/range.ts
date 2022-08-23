import { IndexRange } from 'sharedTypes';
import { sortNumerical } from './list';

export const indicesToRanges: (indices: number[]) => IndexRange[] = (
  indices
) => {
  // make a copy to avoid mutating
  const selection = [...indices];

  // Sort the indices
  sortNumerical(selection);

  let currentStartIndex = selection[0];

  /**
   * This reduce is similar to the 'convertTranscriptToCuts' function, so refer to that
   * for comments about the general approach.
   * What is being achieved is turning a sorted array of indexes into a series of
   * index ranges. For a contiguous selection, there will only be one index range.
   */
  const indexRanges: IndexRange[] = selection.reduce(
    (rangesSoFar, currentIndex, j) => {
      // Note: j refers to the index within this loop, not the index within the transcription itself.
      const isFinalWord = j === selection.length - 1;

      // Final element, so build a range no matter what
      if (isFinalWord) {
        return rangesSoFar.concat({
          startIndex: currentStartIndex,
          endIndex: currentIndex + 1,
        });
      }

      const nextIndex = selection[j + 1];

      if (currentIndex + 1 === nextIndex) {
        return rangesSoFar;
      }

      const newRange: IndexRange = {
        startIndex: currentStartIndex,
        endIndex: currentIndex + 1,
      };

      currentStartIndex = nextIndex;

      return rangesSoFar.concat(newRange);
    },
    [] as IndexRange[]
  );

  return indexRanges;
};

/*
 * Converts a list of ranges into a set of indices - the opposite of getSelectionRanges, basically
 */
export const rangesToIndices: (ranges: IndexRange[]) => Set<number> = (
  ranges
) => {
  const indicesSet = new Set<number>();

  ranges.forEach(({ startIndex, endIndex }) => {
    for (let i = startIndex; i < endIndex; i += 1) {
      indicesSet.add(i);
    }
  });

  return indicesSet;
};

/**
 * Similar to rangesToIndices, but for a single range - also returns as a list and
 * maintains numerical order.
 * @param range
 */
export const rangeToIndices: (range: IndexRange) => number[] = (range) => {
  const indices: number[] = [];

  for (let index = range.startIndex; index < range.endIndex; index += 1) {
    indices.push(index);
  }

  return indices;
};

/**
 * Helper for making IndexRanges with a size of one, e.g. a single word
 */
export const rangeLengthOne: (index: number) => IndexRange = (index) => ({
  startIndex: index,
  endIndex: index + 1,
});
