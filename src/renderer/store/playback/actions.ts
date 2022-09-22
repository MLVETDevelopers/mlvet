import { Action } from '../action';

export const VIDEO_PLAYING = 'VIDEO_PLAYING';
export const VIDEO_SEEK = 'VIDEO_SEEK';
export const VIDEO_SKIP = 'VIDEO_SKIP';

export const videoPlaying: (playbackPlaying: boolean) => Action<boolean> = (
  playbackPlaying
) => ({
  type: VIDEO_PLAYING,
  payload: playbackPlaying,
});

export const videoSeek: (playbackTime: number) => Action<number> = (
  playbackTime
) => ({
  type: VIDEO_SEEK,
  payload: playbackTime,
});

export const videoSkip: (skipTime: number) => Action<number> = (skipTime) => ({
  type: VIDEO_SKIP,
  payload: skipTime,
});
