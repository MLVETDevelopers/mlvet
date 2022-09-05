import { Reducer } from 'redux';
import { rangesToIndices } from 'renderer/utils/range';
import {
  SELECTION_RANGE_ADDED,
  SELECTION_RANGE_REMOVED,
  SELECTION_CLEARED,
  SELECTION_RANGE_TOGGLED,
  SELECTION_RANGES_SET_TO,
  SelectionRangeAddedPayload,
  SelectionRangeRemovedPayload,
  SelectionRangeToggledPayload,
  SelectionRangesSetToPayload,
  SelectionIndicesSetToPayload,
  SelectionClearedPayload,
  SELECTION_INDICES_SET_TO,
} from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';
import { extractSelection, updateSelection } from './helpers';

const selectionReducer: Reducer<ApplicationStore['selection'], Action<any>> = (
  selection = initialStore.selection,
  action
) => {
  if (action.type === SELECTION_RANGE_ADDED) {
    const { range, clientId } = action.payload as SelectionRangeAddedPayload;
    const { startIndex, endIndex } = range;

    const currentSelection = extractSelection(selection, clientId);

    /**
     * Selection is stored in redux as an array because redux
     * is only supposed to store primitives. So cast it to a set to manipulate then
     * convert it back. O(n) with respect to length of transcription which is the same as
     * the degenerate "select everything" case anyway
     */
    const selectionSet = new Set(currentSelection);

    for (let index = startIndex; index < endIndex; index += 1) {
      selectionSet.add(index);
    }

    const newSelection = Array.from(selectionSet);

    return updateSelection(clientId, selection, newSelection);
  }

  if (action.type === SELECTION_RANGE_REMOVED) {
    const { range, clientId } = action.payload as SelectionRangeRemovedPayload;
    const { startIndex, endIndex } = range;

    const currentSelection = extractSelection(selection, clientId);

    // Same caveats as for SELECTION_RANGE_ADDED
    const selectionSet = new Set(currentSelection);

    for (let index = startIndex; index < endIndex; index += 1) {
      selectionSet.delete(index);
    }

    const newSelection = Array.from(selectionSet);

    return updateSelection(clientId, selection, newSelection);
  }

  if (action.type === SELECTION_RANGE_TOGGLED) {
    const { range, clientId } = action.payload as SelectionRangeToggledPayload;
    const { startIndex, endIndex } = range;

    const currentSelection = extractSelection(selection, clientId);

    // Same caveats as for SELECTION_RANGE_ADDED
    const selectionSet = new Set(currentSelection);

    for (let index = startIndex; index < endIndex; index += 1) {
      if (selectionSet.has(index)) {
        selectionSet.delete(index);
      } else {
        selectionSet.add(index);
      }
    }

    const newSelection = Array.from(selectionSet);

    return updateSelection(clientId, selection, newSelection);
  }

  if (action.type === SELECTION_RANGES_SET_TO) {
    const { ranges, clientId } = action.payload as SelectionRangesSetToPayload;

    // Build the selection from scratch out of the single range that was given
    const newSelection = Array.from(rangesToIndices(ranges));

    return updateSelection(clientId, selection, newSelection);
  }

  if (action.type === SELECTION_INDICES_SET_TO) {
    const { indices, clientId } =
      action.payload as SelectionIndicesSetToPayload;

    return updateSelection(clientId, selection, indices);
  }

  if (action.type === SELECTION_CLEARED) {
    const { clientId } = action.payload as SelectionClearedPayload;

    return updateSelection(clientId, selection, []);
  }

  return selection;
};

export default selectionReducer;
