import { CTRL_F_POPOVER_TOGGLED } from '../actions';
import ctrlFReducer from '../reducer';

describe('Ctrl+F Popover reducer', () => {
  it('should toggle popover from false to true', () => {
    expect(
      ctrlFReducer(false, {
        type: CTRL_F_POPOVER_TOGGLED,
        payload: null,
      })
    ).toEqual(true);
  });

  it('should toggle popover from true to false', () => {
    expect(
      ctrlFReducer(true, {
        type: CTRL_F_POPOVER_TOGGLED,
        payload: null,
      })
    ).toEqual(false);
  });
});
