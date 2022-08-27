import { Reducer } from 'react';
import { TakeGroup, TakeInfo } from 'sharedTypes';
import { Action } from '../action';
import { DELETE_TAKE_GROUP, SELECT_TAKE, SET_TAKE_GROUPS } from './actions';

/**
 * Stores the take groups for the current transcription
 */
const takeGroupsReducer: Reducer<TakeGroup[], Action<any>> = (
  takeGroups = [],
  action
) => {
  if (action.type === SET_TAKE_GROUPS) {
    return action.payload;
  }

  if (action.type === SELECT_TAKE) {
    const selectedTakeInfo = action.payload as TakeInfo;

    // Set the isSelected property of all the words in the correct take of the correct take group
    takeGroups.forEach((takeGroup) => {
      if (takeGroup.id === selectedTakeInfo.takeGroupId) {
        takeGroup.activeTakeIndex = selectedTakeInfo.takeIndex;
      }
    });

    return takeGroups;
  }

  if (action.type === DELETE_TAKE_GROUP) {
    const takeGroupId = action.payload as number;

    // Filter out the deleted take
    return takeGroups.filter((takeGroup) => takeGroup.id !== takeGroupId);
  }

  return takeGroups;
};

export default takeGroupsReducer;
