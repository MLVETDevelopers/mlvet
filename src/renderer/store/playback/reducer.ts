import { Reducer } from 'redux';
import { Action } from '../action';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { VIDEO_PLAYING, VIDEO_SEEK, VIDEO_SKIP } from './actions';

const playbackReducer: Reducer<ApplicationStore['playback'], Action<any>> = (
  playback = initialStore.playback,
  action
) => {
  if (action.type === VIDEO_PLAYING) {
    const playState = action.payload as boolean;
    return {
      playbackPlaying: playState,
      playbackTime: playback.playbackTime,
      playbackLastUpdated: new Date(),
    };
  }

  if (action.type === VIDEO_SEEK) {
    const timeState = action.payload as number;
    return {
      playbackPlaying: playback.playbackPlaying,
      playbackTime: timeState,
      playbackLastUpdated: new Date(),
    };
  }

  if (action.type === VIDEO_SKIP) {
    const timeState = action.payload as number;
    if (!playback.playbackPlaying) {
      return {
        playbackPlaying: playback.playbackPlaying,
        playbackTime: playback.playbackTime + timeState,
        playbackLastUpdated: new Date(),
      };
    }

    if (playback.playbackPlaying) {
      const timeDifference =
        (new Date().getTime() - playback.playbackLastUpdated.getTime()) / 1000;
      return {
        playbackPlaying: playback.playbackPlaying,
        playbackTime: playback.playbackTime + timeState + timeDifference,
        playbackLastUpdated: new Date(),
      };
    }
  }

  return playback;
};

export default playbackReducer;
