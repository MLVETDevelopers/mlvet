import { Op } from 'renderer/store/undoStack/helpers';
import { IndexRange } from 'sharedTypes';
import {
  sectionRestored,
  undoSectionRestored,
} from 'renderer/store/transcriptionWords/actions';
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
  do: [sectionRestored(ranges)],
  undo: [undoSectionRestored(ranges)],
});
