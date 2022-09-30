import { Reducer } from 'redux';
import { Action } from '../action';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import {
  CLEAR_RANGE_OVERRIDE,
  SetRangeOverridePayload,
  SET_RANGE_OVERRIDE,
} from './action';

const playbackReducer: Reducer<ApplicationStore['playback'], Action<any>> = (
  playback = initialStore.playback,
  action
) => {
  if (action.type === SET_RANGE_OVERRIDE) {
    const { rangeOverride } = action.payload as SetRangeOverridePayload;

    return {
      rangeOverride,
    };
  }

  if (action.type === CLEAR_RANGE_OVERRIDE) {
    return {
      rangeOverride: null,
    };
  }

  return playback;
};

export default playbackReducer;
