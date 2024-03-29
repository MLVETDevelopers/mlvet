import { Reducer } from 'redux';
import { Word } from 'sharedTypes';
import { CLIPBOARD_UPDATED } from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';

const clipboardReducer: Reducer<ApplicationStore['clipboard'], Action<any>> = (
  clipboard = initialStore.clipboard,
  action
) => {
  if (action.type === CLIPBOARD_UPDATED) {
    return action.payload as Word[];
  }

  return clipboard;
};

export default clipboardReducer;
