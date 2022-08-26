import { TakeGroup, TakeInfo } from '../../../sharedTypes';

export const SET_TAKE_GROUPS = 'SELECT_TAKE';
export const SELECT_TAKE = 'SELECT_TAKE';

export const setTakeGroups: (takeGroups: TakeGroup[]) => void = (
  takeGroups
) => ({
  type: SET_TAKE_GROUPS,
  payload: takeGroups,
});

export const selectTake: (takeInfo: TakeInfo) => void = (takeInfo) => ({
  type: SELECT_TAKE,
  payload: takeInfo,
});
