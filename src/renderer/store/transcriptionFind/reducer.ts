import { Reducer } from 'redux';
import { IndexRange, Word } from 'sharedTypes';
import { mapInRange } from 'sharedUtils';
import { markWordFound, markWordSelected } from 'renderer/utils/words';
import {
  FIND_UPDATED,
  FIND_CLOSED,
  FIND_NEXT,
  FIND_PREV,
  CtrlFindUpdatePayload,
} from './actions';
import { Action } from '../action';

// The reducer needs to
// Reset all highlighting on the transcription words to 0
// Set the highlighting on the words that match accordingly
const transcriptionFindReducer: Reducer<Word[], Action<any>> = (
  words = [],
  action
) => {
  if (action.type === FIND_UPDATED) {
    console.log('transcriptionFind', action, words);
  }

  if (words.length === 0) {
    return words;
  }

  // If action.payload is one of FIND_UPDATED, FIND_NEXT, FIND_PREV, FIND_CLOSED
  if (
    action.type === FIND_UPDATED ||
    action.type === FIND_NEXT ||
    action.type === FIND_PREV ||
    action.type === FIND_CLOSED
  ) {
    const { indexRanges, selectedIndex, maxIndex } =
      action.payload as CtrlFindUpdatePayload;
    if (indexRanges.length === 0) {
      return [];
    }
    const updatedWords: Word[] = [];
    words.forEach((word) => {
      updatedWords.push({
        ...word,
        ctrlFindState: {
          ...word.ctrlFindState,
          selected: false,
        },
      });
    });

    // If search term is updated, update all highlighting information
    if (action.type === FIND_UPDATED) {
      updatedWords.forEach((word) => {
        word.ctrlFindState.searchMatch = false;
      });
      indexRanges.forEach((indexRange: IndexRange) => {
        mapInRange(updatedWords, markWordFound, indexRange);
      });
      mapInRange(updatedWords, markWordSelected, indexRanges[0]);
      return { ...updatedWords };
    }

    // Next button click. Update the selected information
    if (action.type === FIND_NEXT) {
      const nextIndex = (selectedIndex + 1) % maxIndex;
      const newSelectedWordRange = indexRanges[nextIndex];
      mapInRange(updatedWords, markWordSelected, newSelectedWordRange);
      return { ...updatedWords };
    }

    // Prev button click. Update the selected information
    if (action.type === FIND_PREV) {
      let prevIndex = selectedIndex - 1; // TOOD: Use better way to loop index around
      if (prevIndex < 0) {
        prevIndex = maxIndex - 1;
      }
      const newSelectedWordRange = indexRanges[prevIndex];
      mapInRange(updatedWords, markWordSelected, newSelectedWordRange);
      return { ...updatedWords };
    }

    // If Ctrl+F box is closed, remove all highlighting.
    if (action.type === FIND_CLOSED) {
      updatedWords.forEach((word) => {
        word.ctrlFindState.searchMatch = false;
      });
      return { ...updatedWords };
    }
  }

  return words;
};

export default transcriptionFindReducer;
