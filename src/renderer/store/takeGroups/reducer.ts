import { Reducer } from 'react';
import { TakeGroup, TakeInfo } from 'sharedTypes';
import { Action } from '../action';
import {
  DELETE_TAKE_GROUP,
  SELECT_TAKE,
  UNDO_DELETE_TAKE_GROUP,
  UNDO_SELECT_TAKE,
} from './actions';
import {
  UndoDeleteTakeGroupPayload,
  UndoSelectTakePayload,
} from './opPayloads';

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
        ? { ...takeGroup, activeTakeIndex: takeIndex, takeSelected: true }
        : takeGroup
    );
  }

  if (action.type === UNDO_SELECT_TAKE) {
    const { takeGroup } = action.payload as UndoSelectTakePayload;

    return takeGroups.map((tg) => (tg.id === takeGroup.id ? takeGroup : tg));
  }

  if (action.type === DELETE_TAKE_GROUP) {
    const takeGroupId = action.payload as number;

    // Filter out the deleted take group
    return takeGroups.filter((takeGroup) => takeGroup.id !== takeGroupId);
  }

  if (action.type === UNDO_DELETE_TAKE_GROUP) {
    const { takeGroup } = action.payload as UndoDeleteTakeGroupPayload;

    return takeGroups.concat(takeGroup).sort((a, b) => a.id - b.id);
  }

  return takeGroups;
};

export default takeGroupsReducer;
