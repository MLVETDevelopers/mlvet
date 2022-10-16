import { IndexRange, TakeGroup, TakeInfo } from '../../../sharedTypes';
import { Action } from '../action';
import {
  DeleteTakeGroupPayload,
  SelectTakePayload,
  UndoDeleteTakeGroupPayload,
  UndoSelectTakePayload,
} from './opPayloads';

export const SELECT_TAKE = 'SELECT_TAKE';
export const UNDO_SELECT_TAKE = 'UNDO_SELECT_TAKE';
export const DELETE_TAKE_GROUP = 'DELETE_TAKE_GROUP';
export const UNDO_DELETE_TAKE_GROUP = 'UNDO_DELETE_TAKE_GROUP';

export const selectTake: (takeInfo: TakeInfo) => Action<SelectTakePayload> = (
  takeInfo
) => ({
  type: SELECT_TAKE,
  payload: takeInfo,
});

export const undoSelectTake: (
  takeGroup: TakeGroup
) => Action<UndoSelectTakePayload> = (takeGroup) => ({
  type: UNDO_SELECT_TAKE,
  payload: { takeGroup },
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
