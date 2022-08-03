import { IndexRange, Word } from '../sharedTypes';
import { clipboardUpdated } from './store/clipboard/actions';
import {
  selectionCleared,
  selectionRangeAdded,
} from './store/selection/actions';
import store from './store/store';
import { dispatchOp } from './store/undoStack/opHelpers';
import { makeDeleteWord, makePasteWord } from './store/undoStack/ops';

const { dispatch } = store;

const deleteWordRange = (firstWordIndex: number, lastWordIndex: number) => {
  const { currentProject } = store.getState();

  if (currentProject && currentProject.transcription) {
    dispatchOp(makeDeleteWord(firstWordIndex, lastWordIndex));
  }
};

const pasteWord = (afterWordIndex: number, clipboard: Word[]) => {
  const { currentProject } = store.getState();

  if (currentProject && currentProject.transcription) {
    dispatchOp(makePasteWord(afterWordIndex, clipboard));
  }
};

/**
 * Returns a list of ranges consisting of the selected words' indexes
 */
const getSelectionRanges: () => IndexRange[] = () => {
  const { selection: selectionFromState } = store.getState();

  // store.getState() does not return copies, so make a copy to avoid mutating the state
  const selection = [...selectionFromState];

  // Sort the indices
  selection.sort();

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

      currentStartIndex = currentIndex;

      return rangesSoFar.concat(newRange);
    },
    [] as IndexRange[]
  );

  console.log(selection, indexRanges);

  return indexRanges;
};

export const copyText = () => {
  const { currentProject } = store.getState();
  if (currentProject === null) {
    return;
  }

  const { transcription } = currentProject;
  if (transcription === null) {
    return;
  }

  const ranges = getSelectionRanges();
  const clipboard = ranges.flatMap((range) =>
    transcription.words.slice(range.startIndex, range.endIndex)
  );
  dispatch(clipboardUpdated(clipboard));
};

export const deleteText: () => void = () => {
  const ranges = getSelectionRanges();
  ranges.forEach((range) => deleteWordRange(range.startIndex, range.endIndex));

  dispatch(selectionCleared());
};

export const cutText: () => void = () => {
  copyText();
  deleteText();
};

export const pasteText: () => void = () => {
  const { clipboard } = store.getState();

  const ranges = getSelectionRanges();

  if (ranges.length === 0) {
    return;
  }

  // Paste after the last word in the selection
  const { endIndex } = ranges[ranges.length - 1];

  // End index is exclusive, so subtract one to get the actual word to paste after
  pasteWord(endIndex - 1, clipboard);

  // Select the pasted text
  dispatch(selectionCleared());
  dispatch(
    selectionRangeAdded({
      startIndex: endIndex,
      endIndex: endIndex + clipboard.length,
    })
  );
};
