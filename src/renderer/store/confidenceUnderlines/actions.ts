import { Action } from '../action';

export const CONFIDENCE_UNDERLINES_TOGGLED = 'CONFIDENCE_UNDERLINES_TOGGLED';

export const confidenceUnderlinesToggled: () => Action<null> = () => ({
  type: CONFIDENCE_UNDERLINES_TOGGLED,
  payload: null,
});
