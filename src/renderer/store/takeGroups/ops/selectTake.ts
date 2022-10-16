import { Op } from 'renderer/store/undoStack/helpers';
import { TakeGroup, TakeInfo } from 'sharedTypes';
import { SelectTakePayload, UndoSelectTakePayload } from '../opPayloads';
import { selectTake, undoSelectTake } from '../actions';

export type SelectTakeOp = Op<SelectTakePayload, UndoSelectTakePayload>;

export const makeSelectTake: (
  takeInfo: TakeInfo,
  takeGroup: TakeGroup
) => SelectTakeOp = (takeInfo, takeGroup) => ({
  do: [selectTake(takeInfo)],
  undo: [undoSelectTake(takeGroup)],
});
