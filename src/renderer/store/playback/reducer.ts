import { Reducer } from 'redux';
import { Action } from '../action';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { VIDEO_PLAYING } from './actions';

const updatePlaybackPauseReducer: Reducer<
  ApplicationStore['isVideoPlaying'],
  Action<boolean>
> = (isVideoPlaying = initialStore.isVideoPlaying, action) => {
  if (action.type === VIDEO_PLAYING) {
    return action.payload as boolean;
  }

  return isVideoPlaying;
};

export default updatePlaybackPauseReducer;
