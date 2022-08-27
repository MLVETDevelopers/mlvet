import { Reducer } from 'redux';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';
import {
  EDIT_WORD_STARTED,
  EDIT_WORD_UPDATED,
  EDIT_WORD_FINISHED,
  EditWordStartedPayload,
  EditWordUpdatedPayload,
} from './actions';

const editWordReducer: Reducer<ApplicationStore['editWord'], Action<any>> = (
  editWord = initialStore.editWord,
  action
) => {
  if (action.type === EDIT_WORD_STARTED) {
    const { index, text } = action.payload as EditWordStartedPayload;

    return { index, text };
  }

  if (action.type === EDIT_WORD_UPDATED) {
    const { text } = action.payload as EditWordUpdatedPayload;

    if (editWord === null) {
      return null;
    }

    return { text, index: editWord.index };
  }

  if (action.type === EDIT_WORD_FINISHED) {
    return null;
  }

  return editWord;
};

export default editWordReducer;
