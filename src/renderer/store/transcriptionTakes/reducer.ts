import { Reducer } from 'react';
import { TakeInfo, Word } from 'sharedTypes';
import { Action } from '../action';
import { DELETE_TAKE_GROUP, SELECT_TAKE } from '../takeDetection/actions';

/**
 * Nested reducer for handling transcription takes
 */
const transcriptionTakesReducer: Reducer<Word[], Action<any>> = (
  words = [],
  action
) => {
  if (action.type === SELECT_TAKE) {
    const selectedTakeInfo = action.payload as TakeInfo;

    // Set the isSelected property of the correct take in the correct take group
    words.forEach((word) => {
      const wordTakeInfo = word.takeInfo;
      if (
        wordTakeInfo &&
        wordTakeInfo.takeGroupId === selectedTakeInfo.takeGroupId
      ) {
        wordTakeInfo.isSelected =
          selectedTakeInfo.takeIndex === wordTakeInfo.takeIndex;
      }
    });

    return words;
  }

  if (action.type === DELETE_TAKE_GROUP) {
    const takeGroupId = action.payload as number;

    // Change the take info to null for any word in the deleted take group
    return words.map((word) => {
      if (word.takeInfo && word.takeInfo.takeGroupId === takeGroupId) {
        return { ...word, takeInfo: null };
      }
      return word;
    });
  }

  return words;
};

export default transcriptionTakesReducer;
