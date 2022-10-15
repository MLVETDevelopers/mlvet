import { Reducer } from 'redux';
import {
  FIND_UPDATED,
  FIND_CLOSED,
  FIND_NEXT,
  FIND_PREV,
  CtrlFindUpdatePayload,
} from './actions';
import { Action } from '../action';
import { ApplicationStore, initialStore } from '../sharedHelpers';

// The reducer handles the state changes for Ctrl+F search.
const ctrlFSelectionReducer: Reducer<
  ApplicationStore['ctrlFSelection'],
  Action<any>
> = (ctrlFSelection = initialStore.ctrlFSelection, action) => {
  // If search term is updated, update all highlighting information
  if (action.type === FIND_UPDATED) {
    const { indexRanges } = action.payload as CtrlFindUpdatePayload;
    return {
      ...ctrlFSelection,
      selectedIndex: 0,
      maxIndex: indexRanges.length - 1,
      indexRanges,
    };
  }

  // Next button click. Update the selected information
  if (action.type === FIND_NEXT) {
    const nextIndex =
      (ctrlFSelection.selectedIndex + 1) % (ctrlFSelection.maxIndex + 1);
    return {
      ...ctrlFSelection,
      selectedIndex: nextIndex,
    };
  }

  // Prev button click. Update the selected information
  if (action.type === FIND_PREV) {
    const prevIndex =
      ctrlFSelection.selectedIndex === 0
        ? ctrlFSelection.maxIndex
        : ctrlFSelection.selectedIndex - 1;
    return {
      ...ctrlFSelection,
      selectedIndex: prevIndex,
    };
  }

  // If Ctrl+F box is closed, remove all highlighting.
  if (action.type === FIND_CLOSED) {
    return {
      ...ctrlFSelection,
      selectedIndex: 0,
      maxIndex: 0,
      indexRanges: [],
    };
  }

  return ctrlFSelection;
};

export default ctrlFSelectionReducer;
