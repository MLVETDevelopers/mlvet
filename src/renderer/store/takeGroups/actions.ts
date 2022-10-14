import { IndexRange, TakeGroup, TakeInfo } from '../../../sharedTypes';
import { Action } from '../action';
import {
  DeleteTakeGroupPayload,
  SelectTakeGroupPayload,
  UndoDeleteTakeGroupPayload,
} from './opPayloads';

export const SELECT_TAKE = 'SELECT_TAKE';
export const DELETE_TAKE_GROUP = 'DELETE_TAKE_GROUP';
export const UNDO_DELETE_TAKE_GROUP = 'UNDO_DELETE_TAKE_GROUP';

export const selectTake: (
  takeInfo: TakeInfo
) => Action<SelectTakeGroupPayload> = (takeInfo) => ({
  type: SELECT_TAKE,
  payload: takeInfo,
});

export const deleteTakeGroup: (
  takeGroupId: number
) => Action<DeleteTakeGroupPayload> = (takeGroupId) => ({
  type: DELETE_TAKE_GROUP,
  payload: takeGroupId,
});

export const undoDeleteTakeGroup: (
  takeGroup: TakeGroup,
  takeRanges: IndexRange[]
) => Action<UndoDeleteTakeGroupPayload> = (takeGroup, takeRanges) => ({
  type: UNDO_DELETE_TAKE_GROUP,
  payload: { takeGroup, takeRanges },
});
