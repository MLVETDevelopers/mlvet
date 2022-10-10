import { IndexRange } from 'sharedTypes';
import { Action } from '../action';

export const FIND_UPDATED = 'FIND_UPDATED';
export const FIND_CLOSED = 'FIND_CLOSED';
export const FIND_NEXT = 'FIND_NEXT';
export const FIND_PREV = 'FIND_PREV';

export interface CtrlFindUpdatePayload {
  indexRanges: IndexRange[];
}

export const ctrlFindUpdated: (
  ctrlFindPayload: CtrlFindUpdatePayload
) => Action<CtrlFindUpdatePayload> = (ctrlFindUpdatePayload) => ({
  type: FIND_UPDATED,
  payload: ctrlFindUpdatePayload,
});

export const ctrlFindClosed: () => Action<null> = () => ({
  type: FIND_CLOSED,
  payload: null,
});

// On an update; the CtrlFindState of all words need to be reset
// searchMatch recalculated
// selected set to false on all except the first occurrence (true)

// On a close; the CtrlFindState of all words need to be reset
// searchMatch set to false
// selected set to false

// On next; the selected state of all words need to be changed
// set selected to false on the current word
// set selected to true on the next word

// On previous; the selected state of all words need to be changed
// set selected to false on the current word
// set selected to true on the previous word

// OriginalIndex and PasteKey is the only way to distinguish unique words
// Have Transcription store an array of an array of originalIndex and pasteKeys? or just startand end indexes?

// New Plan: Store an additional object in the transcription object that contains
//  current selected index
//  array of start and end indexes of all occurrences
//  number of found occurrences
// On an update; the CtrlFindState of all words need to be reset
// Send only the start and end indexes of the words that need to be updated
// Use an array index ranges

// On close; send nothing to reducer
// reducer is reset all words

// On next; use the current selected index to find the next index
// reducer uses array of start and end indexes to change highlighting
