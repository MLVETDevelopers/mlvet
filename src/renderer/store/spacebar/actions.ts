import { Action } from '../action';

export const SPACE_PRESSED = 'SPACE_PRESSED';

export const spacePressed: (isSpacePressed: boolean) => Action<boolean> = (
  isSpacePressed
) => ({
  type: SPACE_PRESSED,
  payload: isSpacePressed,
});
