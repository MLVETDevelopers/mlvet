import { Op } from 'renderer/store/undoStack/helpers';
import { IndexRange } from 'sharedTypes';
import {
  selectionDeleted,
  undoSelectionDeleted,
} from 'renderer/store/transcriptionWords/actions';
import {
  selectionCleared,
  selectionRangeAdded,
} from 'renderer/store/selection/actions';
import {
  DeleteSelectionPayload,
  UndoDeleteSelectionPayload,
} from '../opPayloads';

export type DeleteSelectionOp = Op<
  DeleteSelectionPayload,
  UndoDeleteSelectionPayload
>;

export const makeDeleteSelection: (
  ranges: IndexRange[]
) => DeleteSelectionOp = (ranges) => ({
  do: [selectionDeleted(ranges), selectionCleared()],
  undo: [
    undoSelectionDeleted(ranges),
    selectionCleared(),
    ...ranges.map((range) => selectionRangeAdded(range)),
  ],
});
