import { Op } from 'renderer/store/undoStack/helpers';
import { IndexRange } from 'sharedTypes';
import {
  selectionDeleted,
  undoSelectionDeleted,
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

export const makeDeleteSelection: (range: IndexRange) => DeleteSelectionOp = (
  range
) => ({
  do: [selectionDeleted(range), selectionCleared()],
  undo: [undoSelectionDeleted(range), selectionRangeSetTo(range)],
});
