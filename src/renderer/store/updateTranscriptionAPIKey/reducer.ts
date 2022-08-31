import { Reducer } from 'redux';
import { Action } from '../action';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { UPDATE_TRANSCRIPTION_API_KEY_TOGGLED } from './actions';

const updateTranscriptionAPIKeyReducer: Reducer<
  ApplicationStore['isUpdateTranscriptionAPIKeyOpened'],
  Action<boolean>
> = (
  isUpdateTranscriptionAPIKeyOpened = initialStore.isUpdateTranscriptionAPIKeyOpened,
  action
) => {
  if (action.type === UPDATE_TRANSCRIPTION_API_KEY_TOGGLED) {
    return action.payload as boolean;
  }

  return isUpdateTranscriptionAPIKeyOpened;
};

export default updateTranscriptionAPIKeyReducer;
