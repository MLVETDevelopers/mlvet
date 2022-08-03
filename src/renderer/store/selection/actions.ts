import { IndexRange } from '../../../sharedTypes';
import { Action } from '../action';

export const SELECTION_RANGE_ADDED = 'SELECTION_RANGE_ADDED';
export const SELECTION_RANGE_REMOVED = 'SELECTION_RANGE_REMOVED';
export const SELECTION_CLEARED = 'SELECTION_CLEARED';

/**
 * Action to update the selection when a new item, or range of items, is added.
 * For a single item, provide endIndex = startIndex + 1.
 * Range is inclusive-start, exclusive-end (think like Python ranges).
 */
export const selectionRangeAdded: (
  indexRange: IndexRange
) => Action<IndexRange> = (indexRange) => {
  return {
    type: SELECTION_RANGE_ADDED,
    payload: indexRange,
  };
};

/**
 * Same as selectionRangeAdded, but for an item or range that is removed.
 */
export const selectionRangeRemoved: (
  indexRange: IndexRange
) => Action<IndexRange> = (indexRange) => {
  return {
    type: SELECTION_RANGE_REMOVED,
    payload: indexRange,
  };
};

/**
 * Action that clears the active selection.
 */
export const selectionCleared: () => Action<null> = () => {
  return {
    type: SELECTION_CLEARED,
    payload: null,
  };
};
