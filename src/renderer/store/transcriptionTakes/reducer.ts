import { Reducer } from 'react';
import { Word } from 'sharedTypes';
import { mapInRange } from 'sharedUtils';
import { Action } from '../action';
import {
  DELETE_TAKE_GROUP,
  UNDO_DELETE_TAKE_GROUP,
} from '../takeGroups/actions';
import {
  DeleteTakeGroupPayload,
  UndoDeleteTakeGroupPayload,
} from '../takeGroups/opPayloads';

/**
 * Nested reducer for handling transcription takes
 */
const transcriptionTakesReducer: Reducer<Word[], Action<any>> = (
  words = [],
  action
) => {
  if (action.type === DELETE_TAKE_GROUP) {
    const takeGroupId = action.payload as DeleteTakeGroupPayload;

    // Change the take info to null for any word in the deleted take group
    return words.map((word) =>
      word.takeInfo?.takeGroupId === takeGroupId
        ? { ...word, takeInfo: null }
        : word
    );
  }

  if (action.type === UNDO_DELETE_TAKE_GROUP) {
    const { takeGroup, takeRanges } =
      action.payload as UndoDeleteTakeGroupPayload;

    const updateWordTakeInfo = (takeIndex: number) => (word: Word) => ({
      ...word,
      takeInfo: {
        takeGroupId: takeGroup.id,
        takeIndex,
      },
    });

    return takeRanges.reduce((wordsAcc, currRange, currIndex) => {
      return mapInRange(wordsAcc, updateWordTakeInfo(currIndex), currRange);
    }, words);
  }

  return words;
};

export default transcriptionTakesReducer;
