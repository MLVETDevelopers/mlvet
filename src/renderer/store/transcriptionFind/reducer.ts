import { Reducer } from 'redux';
import { HighlightRange, Transcription, Word } from 'sharedTypes';
import { SEARCH_UPDATED, SEARCH_CLOSED } from './actions';
import { Action } from '../action';

// The reducer needs to
// Reset all highlighting on the transcription words to 0
// Set the highlighting on the words that match accordingly
const transcriptionFindReducer: Reducer<Transcription | null, Action<any>> = (
  transcription = null,
  action
) => {
  if (transcription === null) {
    return null;
  }

  const updatedWords: Word[] = [];
  transcription.words.forEach((word) => {
    updatedWords.push({
      ...word,
      highlightRanges: [],
    });
  });

  // If search term is updated, update all highlighting information
  if (action.type === SEARCH_UPDATED) {
    const startWordIndex = action.payload.wordIndex;
    action.payload.valuesToUpdate.forEach(
      (range: HighlightRange[], index: any) => {
        updatedWords[index + startWordIndex].highlightRanges = range;
      }
    );
    return { ...transcription, ...updatedWords };
  }

  // If Ctrl+F box is closed, remove all highlighting.
  if (action.type === SEARCH_CLOSED) {
    return { ...transcription, words: updatedWords };
  }

  return transcription;
};

export default transcriptionFindReducer;
