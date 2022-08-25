import { Reducer } from 'redux';
import { Action } from '../action';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { SHORTCUTS_TOGGLED } from './actions';

const shortcutsReducer: Reducer<
  ApplicationStore['shortcutsOpened'],
  Action<boolean>
> = (shortcutsOpened = initialStore.shortcutsOpened, action) => {
  if (action.type === SHORTCUTS_TOGGLED) {
    return action.payload as boolean;
  }

  return shortcutsOpened;
};

export default shortcutsReducer;
