/* eslint-disable import/prefer-default-export */

import { selectionRangeAdded } from './store/selection/actions';
import store from './store/store';

const { dispatch } = store;

export const expandSelectionToWord: (wordIndex: number) => void = (
  wordIndex
) => {
  const { selection } = store.getState();

  selection.sort((first, second) => first - second);

  // If the word is already selected, do nothing
  if (selection.some((index) => index === wordIndex)) {
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
