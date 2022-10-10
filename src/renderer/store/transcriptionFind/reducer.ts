import { Reducer } from 'redux';
import { IndexRange, Transcription, Word } from 'sharedTypes';
import { mapInRange } from 'sharedUtils';
import { markWordFound, markWordSelected } from 'renderer/utils/words';
import { FIND_UPDATED, FIND_CLOSED, FIND_NEXT, FIND_PREV } from './actions';
import { Action } from '../action';
import { initialStore } from '../sharedHelpers';

// The reducer needs to
// Reset all highlighting on the transcription words to 0
// Set the highlighting on the words that match accordingly
const transcriptionFindReducer: Reducer<Transcription | null, Action<any>> = (
  transcription = initialStore.currentProject?.transcription ?? null,
  action
) => {
  if (action.type === FIND_UPDATED) {
    console.log('Reducer', action, transcription);
  }
  if (transcription === null) {
    return null;
  }

  const { indexRanges } = action.payload;
  if (indexRanges.length === 0) {
    return null;
  }

  const updatedWords: Word[] = [];
  transcription.words.forEach((word) => {
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
      mapInRange(updatedWords, markWordSelected, indexRange);
    });
    console.log('updatedWords', updatedWords);
    return { ...transcription, ...updatedWords };
  }

  // Next button click. Update the selected information
  if (action.type === FIND_NEXT) {
    const { maxIndex } = transcription.ctrlFindSelected;
    const { selectedIndex } = transcription.ctrlFindSelected;
    const nextIndex = (selectedIndex + 1) % maxIndex;
    const newSelectedWordRange =
      transcription.ctrlFindSelected.indexRanges[nextIndex];
    mapInRange(updatedWords, markWordSelected, newSelectedWordRange);
    return {
      ...transcription,
      words: updatedWords,
      ctrlFindSelected: {
        ...transcription.ctrlFindSelected,
        selectedIndex: nextIndex,
      },
    };
  }

  if (action.type === FIND_PREV) {
    const { maxIndex } = transcription.ctrlFindSelected;
    const { selectedIndex } = transcription.ctrlFindSelected;
    let prevIndex = selectedIndex - 1; // TOOD: Use better way to loop index around
    if (prevIndex < 0) {
      prevIndex = maxIndex - 1;
    }
    const newSelectedWordRange =
      transcription.ctrlFindSelected.indexRanges[prevIndex];
    mapInRange(updatedWords, markWordSelected, newSelectedWordRange);
    return {
      ...transcription,
      words: updatedWords,
      ctrlFindSelected: {
        ...transcription.ctrlFindSelected,
        selectedIndex: prevIndex,
      },
    };
  }

  // If Ctrl+F box is closed, remove all highlighting.
  if (action.type === FIND_CLOSED) {
    updatedWords.forEach((word) => {
      word.ctrlFindState.searchMatch = false;
    });
    return {
      ...transcription,
      ctrlFindSelected: {
        ...transcription.ctrlFindSelected,
        selectedIndex: 0,
        maxIndex: 0,
        indexRanges: [],
      },
      words: updatedWords,
    };
  }

  return transcription;
};

export default transcriptionFindReducer;
