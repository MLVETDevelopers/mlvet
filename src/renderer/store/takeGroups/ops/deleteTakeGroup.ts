import { Op } from 'renderer/store/undoStack/helpers';
import { IndexRange, TakeGroup } from 'sharedTypes';
import {
  DeleteTakeGroupPayload,
  UndoDeleteTakeGroupPayload,
} from '../opPayloads';
import { deleteTakeGroup, undoDeleteTakeGroup } from '../actions';

export type DeleteTakeGroupOp = Op<
  DeleteTakeGroupPayload,
  UndoDeleteTakeGroupPayload
>;

export const makeDeleteTakeGroup: (
  takeGroup: TakeGroup,
  takesRange: IndexRange[]
) => DeleteTakeGroupOp = (takeGroup, takesRange) => ({
  do: [deleteTakeGroup(takeGroup.id)],
  undo: [undoDeleteTakeGroup(takeGroup, takesRange)],
});
