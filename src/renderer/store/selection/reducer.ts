import { Reducer } from 'redux';
import { Index, IndexRange } from '../../../sharedTypes';
import {
  SELECTION_RANGE_ADDED,
  SELECTION_RANGE_REMOVED,
  SELECTION_CLEARED,
} from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';

const selectionReducer: Reducer<ApplicationStore['selection'], Action<any>> = (
  selection = initialStore.selection,
  action
) => {
  if (action.type === SELECTION_RANGE_ADDED) {
    const { startIndex, endIndex } = action.payload as IndexRange;

    /**
     * Selection is stored in redux as an array because redux
     * is only supposed to store primitives. So cast it to a set to manipulate then
     * convert it back. O(n) with respect to length of transcription which is the same as
     * the degenerate "select everything" case anyway
     */
    const selectionSet = new Set(selection);

    for (let index = startIndex; index < endIndex; index += 1) {
      selectionSet.add(index);
    }

    return Array.from(selectionSet);
  }

  if (action.type === SELECTION_RANGE_REMOVED) {
    const { startIndex, endIndex } = action.payload as IndexRange;

    // Same caveats as above
    const selectionSet = new Set(selection);

    for (let index = startIndex; index < endIndex; index += 1) {
      selectionSet.delete(index);
    }

    return Array.from(selectionSet);
  }

  if (action.type === SELECTION_CLEARED) {
    return [] as Index[];
  }

  return selection;
};

export default selectionReducer;
