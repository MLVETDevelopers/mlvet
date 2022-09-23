import { Reducer } from 'redux';
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

const correctTime = (inputTime: number, maxDuration: number) => {
  let returnTime = inputTime;
  if (inputTime < 0) {
    returnTime = 0;
  }
  if (inputTime > maxDuration) {
    returnTime = maxDuration;
  }
  return returnTime;
};

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
        time: correctTime(
          playback.time + timeState.addtime,
          timeState.maxDuration
        ),
        lastUpdated: timeState.lastUpdated,
      };
    }

    if (playback.isPlaying) {
      const timeDifference =
        (new Date().getTime() - playback.lastUpdated.getTime()) / 1000;
      return {
        isPlaying: playback.isPlaying,
        time: correctTime(
          playback.time + timeState.addtime + timeDifference,
          timeState.maxDuration
        ),
        lastUpdated: new Date(),
      };
    }
  }

  return playback;
};

export default playbackReducer;
