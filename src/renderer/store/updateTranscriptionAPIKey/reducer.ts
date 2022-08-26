import { Reducer } from 'redux';
import { Action } from '../action';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { UPDATE_TRANSCRIPTION_API_KEY_TOGGLED } from './actions';

const updateTranscriptionAPIKeyReducer: Reducer<
  ApplicationStore['updateTranscriptionAPIKeyOpened'],
  Action<boolean>
> = (
  updateTranscriptionAPIKeyOpened = initialStore.updateTranscriptionAPIKeyOpened,
  action
) => {
  if (action.type === UPDATE_TRANSCRIPTION_API_KEY_TOGGLED) {
    return action.payload as boolean;
  }

  return updateTranscriptionAPIKeyOpened;
};

export default updateTranscriptionAPIKeyReducer;
