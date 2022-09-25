import { Reducer } from 'redux';
import { clamp } from 'main/timeUtils';
import { Action } from '../action';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import {
  VIDEO_PLAYING,
  VIDEO_SEEK,
  VIDEO_SKIP,
  SET_RANGE_OVERRIDE,
  CLEAR_RANGE_OVERRIDE,
  UpdatedPlaying,
  UpdatedTimeSeek,
  UpdatedTimeSkip,
  SetRangeOverridePayload,
} from './actions';

const playbackReducer: Reducer<ApplicationStore['playback'], Action<any>> = (
  playback = initialStore.playback,
  action
) => {
  if (action.type === VIDEO_PLAYING) {
    const playState = action.payload as UpdatedPlaying;
    const { isPlaying, lastUpdated } = playState;

    return {
      ...playback,
      isPlaying,
      lastUpdated,
    };
  }

  if (action.type === VIDEO_SEEK) {
    const timeState = action.payload as UpdatedTimeSeek;
    const { time, lastUpdated } = timeState;

    return {
      ...playback,
      time,
      lastUpdated,
    };
  }

  if (action.type === VIDEO_SKIP) {
    const timeState = action.payload as UpdatedTimeSkip;
    const { addtime, lastUpdated, maxDuration } = timeState;

    if (!playback.isPlaying) {
      return {
        ...playback,
        time: clamp(playback.time + addtime, 0, maxDuration),
        lastUpdated,
      };
    }

    if (playback.isPlaying) {
      const timeDifference =
        (timeState.lastUpdated.getTime() - playback.lastUpdated.getTime()) /
        1000;
      return {
        ...playback,
        time: clamp(playback.time + addtime + timeDifference, 0, maxDuration),
        lastUpdated: timeState.lastUpdated,
      };
    }
  }

  if (action.type === SET_RANGE_OVERRIDE) {
    const { rangeOverride } = action.payload as SetRangeOverridePayload;

    return {
      ...playback,
      rangeOverride,
    };
  }

  if (action.type === CLEAR_RANGE_OVERRIDE) {
    return {
      ...playback,
      rangeOverride: null,
    };
  }

  return playback;
};

export default playbackReducer;
