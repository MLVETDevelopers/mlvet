import { ClientId } from 'collabTypes/collabShadowTypes';
import { IndexRange } from '../../../sharedTypes';
import { Action } from '../action';

export const SELECTION_RANGE_SET_TO = 'SELECTION_RANGE_SET_TO';
export const SELECTION_CLEARED = 'SELECTION_CLEARED';

export interface SelectionRangeSetToPayload {
  range: IndexRange;
  clientId: ClientId | null;
}

export interface SelectionClearedPayload {
  clientId: ClientId | null; // null if self
}

/**
 * Sets the selected range to be a certain value.
 */
export const selectionRangeSetTo: (
  range: IndexRange,
  clientId?: ClientId | null
) => Action<SelectionRangeSetToPayload> = (range, clientId = null) => ({
  type: SELECTION_RANGE_SET_TO,
  payload: { range, clientId },
});

/**
 * Clears the active selection.
 */
export const selectionCleared: (
  clientId?: ClientId | null
) => Action<SelectionClearedPayload> = (clientId = null) => ({
  type: SELECTION_CLEARED,
  payload: { clientId },
});
