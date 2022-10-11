import { IndexRange, TakeGroup, TakeInfo } from '../../../sharedTypes';

export type SelectTakeGroupPayload = TakeInfo;

export type DeleteTakeGroupPayload = number;

export interface UndoDeleteTakeGroupPayload {
  takeGroup: TakeGroup;
  takeRanges: IndexRange[];
}
