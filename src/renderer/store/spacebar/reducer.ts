import { Reducer } from 'redux';
import { Action } from '../action';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { SPACE_PRESSED } from './actions';

const updateSpacePressedReducer: Reducer<
  ApplicationStore['isSpacePressed'],
  Action<boolean>
> = (isSpacePressed = initialStore.isSpacePressed, action) => {
  if (action.type === SPACE_PRESSED) {
    return action.payload as boolean;
  }

  return isSpacePressed;
};

export default updateSpacePressedReducer;
