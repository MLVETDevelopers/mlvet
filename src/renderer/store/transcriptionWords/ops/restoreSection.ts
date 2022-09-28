import { Op } from 'renderer/store/undoStack/helpers';
import { IndexRange } from 'sharedTypes';
import {
  sectionRestored,
  undoSectionRestored,
} from 'renderer/store/transcriptionWords/actions';
import {
  selectionCleared,
  selectionRangeSetTo,
} from 'renderer/store/selection/actions';
import {
  RestoreSectionPayload,
  UndoRestoreSectionPayload,
} from '../opPayloads';

export type RestoreSectionOp = Op<
  RestoreSectionPayload,
  UndoRestoreSectionPayload
>;

export const makeRestoreSection: (range: IndexRange) => RestoreSectionOp = (
  range
) => ({
  do: [sectionRestored(range), selectionRangeSetTo(range)],
  undo: [undoSectionRestored(range), selectionCleared()],
});
