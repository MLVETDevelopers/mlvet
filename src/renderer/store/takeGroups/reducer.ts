import { Reducer } from 'react';
import { TakeGroup, TakeInfo } from 'sharedTypes';
import { Action } from '../action';
import { DELETE_TAKE_GROUP, SELECT_TAKE } from './actions';

/**
 * Stores the take groups for the current transcription
 */
const takeGroupsReducer: Reducer<TakeGroup[], Action<any>> = (
  takeGroups = [],
  action
) => {
  if (action.type === SELECT_TAKE) {
    const { takeGroupId, takeIndex } = action.payload as TakeInfo;

    return takeGroups.map((takeGroup) =>
      takeGroup.id === takeGroupId
        ? { ...takeGroup, activeTakeIndex: takeIndex }
        : takeGroup
    );
  }

  if (action.type === DELETE_TAKE_GROUP) {
    const takeGroupId = action.payload as number;

    // Filter out the deleted take group
    return takeGroups.filter((takeGroup) => takeGroup.id !== takeGroupId);
  }

  return takeGroups;
};

export default takeGroupsReducer;
