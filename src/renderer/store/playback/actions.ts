import { IndexRange } from 'sharedTypes';
import { Action } from '../action';

export const VIDEO_PLAYING = 'VIDEO_PLAYING';
export const VIDEO_SEEK = 'VIDEO_SEEK';
export const VIDEO_SKIP = 'VIDEO_SKIP';
export const SET_RANGE_OVERRIDE = 'SET_RANGE_OVERRIDE';
export const CLEAR_RANGE_OVERRIDE = 'CLEAR_RANGE_OVERRIDE';

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

export interface SetRangeOverridePayload {
  rangeOverride: IndexRange;
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

export const setRangeOverride: (
  rangeOverride: IndexRange
) => Action<SetRangeOverridePayload> = (rangeOverride) => ({
  type: SET_RANGE_OVERRIDE,
  payload: { rangeOverride },
});

export const clearRangeOverride: () => Action<null> = () => ({
  type: CLEAR_RANGE_OVERRIDE,
  payload: null,
});
