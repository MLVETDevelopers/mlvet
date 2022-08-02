import { Reducer } from 'redux';
import { CLIPBOARD_UPDATED } from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { ClipboardContent } from './helpers';
import { Action } from '../action';

const clipboardReducer: Reducer<ApplicationStore['clipboard'], Action<any>> = (
  clipboard = initialStore.clipboard,
  action
) => {
  if (action.type === CLIPBOARD_UPDATED) {
    return action.payload as ClipboardContent;
  }

  return clipboard;
};

export default clipboardReducer;
