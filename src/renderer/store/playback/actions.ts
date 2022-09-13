import { Action } from '../action';

export const VIDEO_PAUSED = 'VIDEO_PAUSED';
export const SPACE_PRESSED = 'SPACE_PRESSED';

export const videoPaused: (isVideoPaused: boolean) => Action<boolean> = (
  isVideoPaused
) => ({
  type: VIDEO_PAUSED,
  payload: isVideoPaused,
});
