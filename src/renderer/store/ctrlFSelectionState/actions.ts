import { IndexRange } from 'sharedTypes';
import { Action } from '../action';

export const FIND_UPDATED = 'FIND_UPDATED';
export const FIND_CLOSED = 'FIND_CLOSED';
export const FIND_NEXT = 'FIND_NEXT';
export const FIND_PREV = 'FIND_PREV';

export interface CtrlFindUpdatePayload {
  selectedIndex: number;
  maxIndex: number;
  indexRanges: IndexRange[];
}

export const ctrlFindUpdated: (
  ctrlFindPayload: CtrlFindUpdatePayload
) => Action<CtrlFindUpdatePayload> = (ctrlFindUpdatePayload) => ({
  type: FIND_UPDATED,
  payload: ctrlFindUpdatePayload,
});

export const ctrlFindNext: (
  ctrlFindPayload: CtrlFindUpdatePayload
) => Action<CtrlFindUpdatePayload> = (ctrlFindUpdatePayload) => ({
  type: FIND_NEXT,
  payload: ctrlFindUpdatePayload,
});

export const ctrlFindPrev: (
  ctrlFindPayload: CtrlFindUpdatePayload
) => Action<CtrlFindUpdatePayload> = (ctrlFindUpdatePayload) => ({
  type: FIND_PREV,
  payload: ctrlFindUpdatePayload,
});

export const ctrlFindClosed: () => Action<null> = () => ({
  type: FIND_CLOSED,
  payload: null,
});
