import { IndexRange, TakeGroup, TakeInfo } from '../../../sharedTypes';

export type SelectTakePayload = TakeInfo;

export interface UndoSelectTakePayload {
  takeGroup: TakeGroup;
}

export type DeleteTakeGroupPayload = number;

export interface UndoDeleteTakeGroupPayload {
  takeGroup: TakeGroup;
  takeRanges: IndexRange[];
}
