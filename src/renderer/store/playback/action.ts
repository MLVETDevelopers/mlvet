import { IndexRange } from 'sharedTypes';
import { Action } from '../action';

export const SET_RANGE_OVERRIDE = 'SET_RANGE_OVERRIDE';
export const CLEAR_RANGE_OVERRIDE = 'CLEAR_RANGE_OVERRIDE';

export interface SetRangeOverridePayload {
  rangeOverride: IndexRange;
}

export const setRangeOverride: (
  rangeOverride: IndexRange
) => Action<SetRangeOverridePayload> = (rangeOverride) => ({
  type: SET_RANGE_OVERRIDE,
  payload: { rangeOverride },
});

export const clearRangeOverride: () => Action<null> = () => ({
  type: CLEAR_RANGE_OVERRIDE,
  payload: null,
});
