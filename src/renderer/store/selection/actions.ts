import { IndexRange } from '../../../sharedTypes';
import { Action } from '../action';

export const SELECTION_RANGE_ADDED = 'SELECTION_RANGE_ADDED';
export const SELECTION_RANGE_REMOVED = 'SELECTION_RANGE_REMOVED';
export const SELECTION_RANGE_TOGGLED = 'SELECTION_RANGE_TOGGLED';
export const SELECTION_RANGE_SET_TO = 'SELECTION_RANGE_SET_TO';
export const SELECTION_CLEARED = 'SELECTION_CLEARED';

/**
 * Action to update the selection when a new item, or range of items, is added.
 * For a single item, provide endIndex = startIndex + 1.
 * Range is inclusive-start, exclusive-end (think like Python ranges).
 */
export const selectionRangeAdded: (
  indexRange: IndexRange
) => Action<IndexRange> = (indexRange) => ({
  type: SELECTION_RANGE_ADDED,
  payload: indexRange,
});

/**
 * Same as selectionRangeAdded, but for an item or range that is removed.
 */
export const selectionRangeRemoved: (
  indexRange: IndexRange
) => Action<IndexRange> = (indexRange) => ({
  type: SELECTION_RANGE_REMOVED,
  payload: indexRange,
});

/**
 * Same as selectionRangeAdded, but for each item in the range, toggle whether it is selected or not.
 */
export const selectionRangeToggled: (
  indexRange: IndexRange
) => Action<IndexRange> = (indexRange) => ({
  type: SELECTION_RANGE_TOGGLED,
  payload: indexRange,
});

/**
 * Efficiently sets the range to be a certain value.
 */
export const selectionRangeSetTo: (
  indexRange: IndexRange
) => Action<IndexRange> = (indexRange) => ({
  type: SELECTION_RANGE_SET_TO,
  payload: indexRange,
});

/**
 * Action that clears the active selection.
 */
export const selectionCleared: () => Action<null> = () => ({
  type: SELECTION_CLEARED,
  payload: null,
});
