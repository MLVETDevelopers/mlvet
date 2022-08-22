import { Reducer } from 'redux';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';
import { EDIT_WORD_INDEX_CLEARED, EDIT_WORD_INDEX_SET } from './actions';

const editWordIndexReducer: Reducer<
  ApplicationStore['editWordIndex'],
  Action<any>
> = (editWordIndex = initialStore.editWordIndex, action) => {
  if (action.type === EDIT_WORD_INDEX_SET) {
    const { index } = action.payload as { index: number };

    return index;
  }

  if (action.type === EDIT_WORD_INDEX_CLEARED) {
    return null;
  }

  return editWordIndex;
};

export default editWordIndexReducer;
