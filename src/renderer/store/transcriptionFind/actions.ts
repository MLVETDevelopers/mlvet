import { HighlightRange } from 'sharedTypes';
import { Action } from '../action';

export const SEARCH_UPDATED = 'SEARCH_UPDATED';
export const SEARCH_CLOSED = 'SEARCH_CLOSED';

export interface SearchOccurrencePayload {
  wordIndex: number;
  highlightRanges: HighlightRange[];
}

export const searchOccurrenceUpdated: (
  searchOccurencePayload: SearchOccurrencePayload
) => Action<SearchOccurrencePayload> = (highlightRanges) => ({
  type: SEARCH_UPDATED,
  payload: highlightRanges,
});
