import { Action } from '../action';

export const VIDEO_PLAYING = 'VIDEO_PLAYING';
export const VIDEO_SEEK = 'VIDEO_SEEK';
export const VIDEO_SKIP = 'VIDEO_SKIP';

export interface UpdatedPlaying {
  isPlaying: boolean;
  lastUpdated: Date;
}

export interface UpdatedTimeSeek {
  time: number;
  lastUpdated: Date;
}

export interface UpdatedTimeSkip {
  addtime: number;
  lastUpdated: Date;
  maxDuration: number;
}

export const videoPlaying: (
  playingState: UpdatedPlaying
) => Action<UpdatedPlaying> = (playingState) => ({
  type: VIDEO_PLAYING,
  payload: playingState,
});

export const videoSeek: (
  timeState: UpdatedTimeSeek
) => Action<UpdatedTimeSeek> = (timeState) => ({
  type: VIDEO_SEEK,
  payload: timeState,
});

export const videoSkip: (
  timeState: UpdatedTimeSkip
) => Action<UpdatedTimeSkip> = (timeState) => ({
  type: VIDEO_SKIP,
  payload: timeState,
});
