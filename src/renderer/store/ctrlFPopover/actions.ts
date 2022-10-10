import { Action } from '../action';

export const CTRL_F_POPOVER_TOGGLED = 'CTRL_F_POPOVER_TOGGLED';

export const ctrlFPopoverToggled: () => Action<null> = () => ({
  type: CTRL_F_POPOVER_TOGGLED,
  payload: null,
});
