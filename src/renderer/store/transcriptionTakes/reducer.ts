import { Reducer } from 'react';
import { TakeInfo, Word } from 'sharedTypes';
import { Action } from '../action';
import { SELECT_TAKE } from '../takeDetection/actions';

/**
 * Nested reducer for handling transcription takes
 */
const transcriptionTakesReducer: Reducer<Word[], Action<TakeInfo>> = (
  words = [],
  action
) => {
  if (action.type === SELECT_TAKE) {
    const selectedTakeInfo = action.payload;

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

  return words;
};

export default transcriptionTakesReducer;
