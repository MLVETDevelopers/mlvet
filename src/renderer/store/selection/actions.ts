import { ClientId } from 'collabTypes/collabShadowTypes';
import { IndexRange } from '../../../sharedTypes';
import { Action } from '../action';
import { SelectionIndices } from './helpers';

export const SELECTION_RANGE_ADDED = 'SELECTION_RANGE_ADDED';
export const SELECTION_RANGE_REMOVED = 'SELECTION_RANGE_REMOVED';
export const SELECTION_RANGE_TOGGLED = 'SELECTION_RANGE_TOGGLED';
export const SELECTION_RANGES_SET_TO = 'SELECTION_RANGES_SET_TO';
export const SELECTION_INDICES_SET_TO = 'SELECTION_INDICES_SET_TO';
export const SELECTION_CLEARED = 'SELECTION_CLEARED';

export interface SelectionRangeAddedPayload {
  range: IndexRange;
  clientId: ClientId | null; // null if self
}

export type SelectionRangeRemovedPayload = SelectionRangeAddedPayload;

export type SelectionRangeToggledPayload = SelectionRangeAddedPayload;

export interface SelectionRangesSetToPayload {
  ranges: IndexRange[];
  clientId: ClientId | null;
}

export interface SelectionIndicesSetToPayload {
  indices: SelectionIndices;
  clientId: ClientId | null;
}

export interface SelectionClearedPayload {
  clientId: ClientId | null; // null if self
}

/**
 * Action to update the selection when a new item, or range of items, is added.
 * For a single item, provide endIndex = startIndex + 1.
 * Range is inclusive-start, exclusive-end (think like Python ranges).
 */
export const selectionRangeAdded: (
  range: IndexRange,
  clientId?: ClientId | null // null if self
) => Action<SelectionRangeAddedPayload> = (range, clientId = null) => ({
  type: SELECTION_RANGE_ADDED,
  payload: { range, clientId },
});

/**
 * Same as selectionRangeAdded, but for an item or range that is removed.
 */
export const selectionRangeRemoved: (
  range: IndexRange,
  clientId?: ClientId | null // null if self
) => Action<SelectionRangeRemovedPayload> = (range, clientId = null) => ({
  type: SELECTION_RANGE_REMOVED,
  payload: { range, clientId },
});

/**
 * Same as selectionRangeAdded, but for each item in the range, toggle whether it is selected or not.
 */
export const selectionRangeToggled: (
  range: IndexRange,
  clientId?: ClientId | null
) => Action<SelectionRangeToggledPayload> = (range, clientId = null) => ({
  type: SELECTION_RANGE_TOGGLED,
  payload: { range, clientId },
});

/**
 * Sets the ranges to be a certain value.
 */
export const selectionRangesSetTo: (
  ranges: IndexRange[],
  clientId?: ClientId | null
) => Action<SelectionRangesSetToPayload> = (ranges, clientId = null) => ({
  type: SELECTION_RANGES_SET_TO,
  payload: { ranges, clientId },
});

/**
 * Sets the selection to be a certain value directly.
 */
export const selectionIndicesSetTo: (
  indices: SelectionIndices,
  clientId?: ClientId | null
) => Action<SelectionIndicesSetToPayload> = (indices, clientId = null) => ({
  type: SELECTION_INDICES_SET_TO,
  payload: { indices, clientId },
});

/**
 * Action that clears the active selection.
 */
export const selectionCleared: (
  clientId?: ClientId | null
) => Action<SelectionClearedPayload> = (clientId = null) => ({
  type: SELECTION_CLEARED,
  payload: { clientId },
});
