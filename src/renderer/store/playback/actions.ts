import { Action } from '../action';

export const VIDEO_PLAYING = 'VIDEO_PLAYING';

export const videoPlaying: (isVideoPlaying: boolean) => Action<boolean> = (
  isVideoPlaying
) => ({
  type: VIDEO_PLAYING,
  payload: isVideoPlaying,
});
