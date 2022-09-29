import { Reducer } from 'redux';
import { clamp } from 'main/timeUtils';
import { Action } from '../action';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import {
  VIDEO_PLAYING,
  VIDEO_SEEK,
  VIDEO_SKIP,
  UpdatedPlaying,
  UpdatedTimeSeek,
  UpdatedTimeSkip,
} from './actions';

const playbackReducer: Reducer<ApplicationStore['playback'], Action<any>> = (
  playback = initialStore.playback,
  action
) => {
  if (action.type === VIDEO_PLAYING) {
    const playState = action.payload as UpdatedPlaying;
    return {
      isPlaying: playState.isPlaying,
      time: playback.time,
      lastUpdated: playState.lastUpdated,
    };
  }

  if (action.type === VIDEO_SEEK) {
    const timeState = action.payload as UpdatedTimeSeek;
    return {
      isPlaying: playback.isPlaying,
      time: timeState.time,
      lastUpdated: timeState.lastUpdated,
    };
  }

  if (action.type === VIDEO_SKIP) {
    const timeState = action.payload as UpdatedTimeSkip;

    if (!playback.isPlaying) {
      return {
        isPlaying: playback.isPlaying,
        time: clamp(
          playback.time + timeState.addtime,
          0,
          timeState.maxDuration
        ),
        lastUpdated: timeState.lastUpdated,
      };
    }

    if (playback.isPlaying) {
      const timeDifference =
        (timeState.lastUpdated.getTime() - playback.lastUpdated.getTime()) /
        1000;
      return {
        isPlaying: playback.isPlaying,
        time: clamp(
          playback.time + timeState.addtime + timeDifference,
          0,
          timeState.maxDuration
        ),
        lastUpdated: timeState.lastUpdated,
      };
    }
  }

  return playback;
};

export default playbackReducer;
