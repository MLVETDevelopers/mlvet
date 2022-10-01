import { IndexRange, RangeType } from 'sharedTypes';
import { Action } from '../action';

export const SET_RANGE_OVERRIDE = 'SET_RANGE_OVERRIDE';
export const CLEAR_RANGE_OVERRIDE = 'CLEAR_RANGE_OVERRIDE';

export interface SetRangeOverridePayload {
  rangeOverride: IndexRange;
  rangeType: RangeType;
}

export const setRangeOverride: (
  rangeOverride: IndexRange,
  rangeType: RangeType
) => Action<SetRangeOverridePayload> = (rangeOverride, rangeType) => ({
  type: SET_RANGE_OVERRIDE,
  payload: { rangeOverride, rangeType },
});

export const clearRangeOverride: () => Action<null> = () => ({
  type: CLEAR_RANGE_OVERRIDE,
  payload: null,
});
