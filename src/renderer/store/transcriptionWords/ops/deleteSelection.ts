import { Op } from 'renderer/store/undoStack/helpers';
import { IndexRange } from 'sharedTypes';
import {
  selectionDeleted as wordsDeleted,
  undoSelectionDeleted as undoWordsDeleted,
} from 'renderer/store/transcriptionWords/actions';
import {
  selectionCleared,
  selectionRangeSetTo,
} from 'renderer/store/selection/actions';
import {
  DeleteSelectionPayload,
  UndoDeleteSelectionPayload,
} from '../opPayloads';

export type DeleteSelectionOp = Op<
  DeleteSelectionPayload,
  UndoDeleteSelectionPayload
>;

/**
 * Makes an op to delete the words with the given indices.
 * Indices are given instead of a range so that already-deleted
 * words can be excluded.
 * The indices given must be in ascending order.
 * The list of indices cannot be empty.
 * On undo, the selection will be restored to the maximal range of the indices.
 * @returns
 */
export const makeDeleteWords: (indices: number[]) => DeleteSelectionOp = (
  indices
) => {
  // Selection range containing all the indices (assuming they are
  // in ascending order), plus possibly other values if the indices
  // were non-contiguous. This is because a selection must be contiguous
  // but the words to delete aren't necessarily contiguous.
  const selectionRange: IndexRange = {
    startIndex: indices[0],
    endIndex: indices[indices.length - 1] + 1,
  };

  return {
    do: [wordsDeleted(indices), selectionCleared()],
    undo: [undoWordsDeleted(indices), selectionRangeSetTo(selectionRange)],
  };
};
