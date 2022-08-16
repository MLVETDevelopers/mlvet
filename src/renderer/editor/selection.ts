import { IndexRange, OperatingSystems } from '../../sharedTypes';
import ipc from '../ipc';
import {
  selectionCleared,
  selectionRangeAdded,
  selectionRangeToggled,
} from '../store/selection/actions';
import store from '../store/store';
import { sortNumerical } from '../util';

const { dispatch } = store;

/**
 * Returns a list of ranges consisting of the selected words' indexes
 */
export const getSelectionRanges: () => IndexRange[] = () => {
  const { selection } = store.getState();

  return indicesToRanges(selection);
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
    dispatch(selectionRangeAdded(rangeLengthOne(wordIndex)));
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
) => Promise<void> = async (event, index) => {
  const singleWordRange = rangeLengthOne(index);

  const os = await ipc.handleOsQuery();
  const hasCmdCtrlModifier =
    os === OperatingSystems.MACOS ? event.metaKey : event.ctrlKey;

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

export const selectAllWords: () => void = () => {
  const { currentProject } = store.getState();

  if (currentProject === null || currentProject?.transcription === null) {
    return;
  }

  dispatch(
    selectionRangeAdded({
      startIndex: 0,
      endIndex: currentProject.transcription.words.length,
    })
  );
};
