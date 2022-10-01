import { Reducer } from 'redux';
import { Action } from '../action';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import {
  UPDATE_TRANSCRIPTION_API_KEY_TOGGLED,
  UPDATE_TRANSCRIPTION_CHOICE_TOGGLED,
} from './actions';

const menuCustomModalsReducer: Reducer<
  ApplicationStore['menuCustomModals'],
  Action<boolean>
> = (menuCustomModals = initialStore.menuCustomModals, action) => {
  if (action.type === UPDATE_TRANSCRIPTION_API_KEY_TOGGLED) {
    return {
      ...menuCustomModals,
      isUpdateTranscriptionAPIKeyOpened: action.payload as boolean,
    };
  }

  if (action.type === UPDATE_TRANSCRIPTION_CHOICE_TOGGLED) {
    return {
      ...menuCustomModals,
      isUpdateTranscriptionChoiceOpened: action.payload as boolean,
    };
  }

  return menuCustomModals;
};

export default menuCustomModalsReducer;
