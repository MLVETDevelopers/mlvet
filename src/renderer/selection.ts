import { IndexRange } from '../sharedTypes';
import {
  selectionCleared,
  selectionRangeAdded,
  selectionRangeToggled,
} from './store/selection/actions';
import store from './store/store';
import { sortNumerical } from './util';

const { dispatch } = store;

/**
 * Returns a list of ranges consisting of the selected words' indexes
 */
export const getSelectionRanges: () => IndexRange[] = () => {
  const { selection: selectionFromState } = store.getState();

  // store.getState() does not return copies, so make a copy to avoid mutating the state
  const selection = [...selectionFromState];

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

export const expandSelectionToWord: (wordIndex: number) => void = (
  wordIndex
) => {
  const { selection } = store.getState();

  sortNumerical(selection);

  // If the word is already selected, do nothing
  if (selection.some((index) => index === wordIndex)) {
    return;
  }

  // If the selection is empty, select the word normally
  if (selection.length === 0) {
    dispatch(
      selectionRangeAdded({
        startIndex: wordIndex,
        endIndex: wordIndex + 1,
      })
    );
    return;
  }

  const minIndexInSelection = Math.min(...selection);
  const maxIndexInSelection = Math.max(...selection);

  if (wordIndex < minIndexInSelection) {
    dispatch(
      selectionRangeAdded({
        startIndex: wordIndex,
        endIndex: minIndexInSelection,
      })
    );
  } else if (wordIndex > maxIndexInSelection) {
    dispatch(
      selectionRangeAdded({
        startIndex: maxIndexInSelection + 1,
        endIndex: wordIndex + 1,
      })
    );
  } else {
    // We're in the middle of the selection - find the largest index smaller
    // than the selected one and the smallest index larger, and then 'paint fill' between them
    const smallestToRightIndex = selection.findIndex(
      (index) => index > wordIndex
    );
    const largestToLeft = selection[smallestToRightIndex - 1];
    const smallestToRight = selection[smallestToRightIndex];

    dispatch(
      selectionRangeAdded({
        startIndex: largestToLeft + 1,
        endIndex: smallestToRight,
      })
    );
  }
};

export const handleSelectWord: (
  event: React.MouseEvent<HTMLDivElement>,
  wordIndex: number
) => void = (event, index) => {
  const singleWordRange: IndexRange = {
    startIndex: index,
    endIndex: index + 1,
  };

  // TODO(chloe): check ctrl key only on windows, meta key only on mac
  const hasCmdCtrlModifier = event.metaKey || event.ctrlKey;
  const hasShiftModifier = event.shiftKey;

  if (hasCmdCtrlModifier) {
    // Cmd/Ctrl is held, so toggle the current word
    dispatch(selectionRangeToggled(singleWordRange));
  } else if (hasShiftModifier) {
    // Shift is held, so expand the selection out to the clicked word
    expandSelectionToWord(index);
  } else {
    // No modifier, so reset the selection to only be this word
    dispatch(selectionCleared());
    dispatch(selectionRangeToggled(singleWordRange));
  }
};
