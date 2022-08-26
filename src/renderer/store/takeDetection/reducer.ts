import { Reducer } from 'react';
import { TakeInfo } from 'sharedTypes';
import { Action } from '../action';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { SELECT_TAKE, SET_TAKE_GROUPS } from './actions';

/**
 *
 */
const takeDetectionReducer: Reducer<ApplicationStore['takes'], Action<any>> = (
  takes = initialStore.takes,
  action
) => {
  if (action.type === SET_TAKE_GROUPS) {
    return action.payload;
  }

  if (action.type === SELECT_TAKE) {
    const selectedTakeInfo = action.payload as TakeInfo;

    takes.forEach((takeGroup) => {
      if (takeGroup.id === selectedTakeInfo.takeGroupId) {
        takeGroup.activeTakeIndex = selectedTakeInfo.takeIndex;
      }
    });

    return takes;
  }

  return takes;
};

export default takeDetectionReducer;
