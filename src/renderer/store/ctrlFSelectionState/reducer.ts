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

// The reducer needs to
// Reset all highlighting on the transcription words
// Set the highlighting on the words that match accordingly
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
    let prevIndex = ctrlFSelection.selectedIndex - 1; // TODO: Use better way to loop index around
    if (prevIndex < 0) {
      prevIndex = ctrlFSelection.maxIndex;
    }
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
