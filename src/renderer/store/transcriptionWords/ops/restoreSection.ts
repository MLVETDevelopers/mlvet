import { Op } from 'renderer/store/undoStack/helpers';
import { IndexRange } from 'sharedTypes';
import {
  sectionRestored,
  undoSectionRestored,
} from 'renderer/store/transcriptionWords/actions';
import {
  selectionCleared,
  selectionRangeAdded,
} from 'renderer/store/selection/actions';
import {
  RestoreSectionPayload,
  UndoRestoreSectionPayload,
} from '../opPayloads';

export type RestoreSectionOp = Op<
  RestoreSectionPayload,
  UndoRestoreSectionPayload
>;

export const makeRestoreSection: (ranges: IndexRange[]) => RestoreSectionOp = (
  ranges
) => ({
  do: [
    sectionRestored(ranges),
    ...ranges.map((range) => selectionRangeAdded(range)),
  ],
  undo: [undoSectionRestored(ranges), selectionCleared()],
});
