import { Reducer } from 'redux';
import { Action } from '../action';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { VIDEO_PAUSED } from './actions';

const updatePlaybackPauseReducer: Reducer<
  ApplicationStore['isVideoPaused'],
  Action<boolean>
> = (isVideoPaused = initialStore.isVideoPaused, action) => {
  if (action.type === VIDEO_PAUSED) {
    return action.payload as boolean;
  }

  return isVideoPaused;
};

// const updateTranscriptionAPIKeyReducer: Reducer<
//   ApplicationStore['isUpdateTranscriptionAPIKeyOpened'],
//   Action<boolean>
// > = (
//   isUpdateTranscriptionAPIKeyOpened = initialStore.isUpdateTranscriptionAPIKeyOpened,
//   action
// ) => {
//   if (action.type === UPDATE_TRANSCRIPTION_API_KEY_TOGGLED) {
//     return action.payload as boolean;
//   }

//   return isUpdateTranscriptionAPIKeyOpened;
// };

export default updatePlaybackPauseReducer;
