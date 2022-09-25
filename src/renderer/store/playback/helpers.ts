import { IndexRange } from 'sharedTypes';

export interface PlaybackState {
  isPlaying: boolean;
  time: number;
  lastUpdated: Date;
  rangeOverride: IndexRange | null;
}
