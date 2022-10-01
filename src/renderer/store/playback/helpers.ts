import { IndexRange, RangeType } from 'sharedTypes';

export interface PlaybackState {
  rangeOverride: IndexRange | null;
  rangeType: RangeType | null;
}
