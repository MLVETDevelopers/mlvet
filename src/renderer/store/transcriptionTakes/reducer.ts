import { Reducer } from 'react';
import { Word } from 'sharedTypes';
import { Action } from '../action';
import { DELETE_TAKE_GROUP } from '../takeGroups/actions';

/**
 * Nested reducer for handling transcription takes
 */
const transcriptionTakesReducer: Reducer<Word[], Action<any>> = (
  words = [],
  action
) => {
  if (action.type === DELETE_TAKE_GROUP) {
    const takeGroupId = action.payload as number;

    // Change the take info to null for any word in the deleted take group
    return words.map((word) =>
      word.takeInfo?.takeGroupId === takeGroupId
        ? { ...word, takeInfo: null }
        : word
    );
  }

  return words;
};

export default transcriptionTakesReducer;
