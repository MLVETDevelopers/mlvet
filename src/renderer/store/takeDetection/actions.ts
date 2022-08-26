import { TakeGroup, TakeInfo } from '../../../sharedTypes';

export const SET_TAKE_GROUPS = 'SET_TAKE_GROUPS';
export const SELECT_TAKE = 'SELECT_TAKE';
export const DELETE_TAKE_GROUP = 'DELETE_TAKE_GROUP';

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

export const deleteTakeGroup: (takeGroupId: number) => void = (
  takeGroupId
) => ({
  type: DELETE_TAKE_GROUP,
  payload: takeGroupId,
});
