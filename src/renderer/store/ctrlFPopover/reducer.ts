import { Reducer } from 'redux';
import { CTRL_F_POPOVER_TOGGLED } from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';

const ctrlFReducer: Reducer<
  ApplicationStore['isShowingCtrlFPopover'],
  Action<any>
> = (isShowingCtrlFPopover = initialStore.isShowingCtrlFPopover, action) => {
  if (action.type === CTRL_F_POPOVER_TOGGLED) {
    return !isShowingCtrlFPopover;
  }

  return isShowingCtrlFPopover;
};

export default ctrlFReducer;
