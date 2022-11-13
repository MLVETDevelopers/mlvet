import { IndexRange } from 'sharedTypes';
import ctrlFSelectionReducer from '../reducer';
import {
  FIND_UPDATED,
  FIND_NEXT,
  FIND_PREV,
  FIND_CLOSED,
  CtrlFindUpdatePayload,
} from '../actions';

describe('Ctrl+F Selection State reducer', () => {
  it('should update the selection state', () => {
    const initialState = {
      selectedIndex: 0,
      maxIndex: 0,
      indexRanges: [],
    };
    expect(
      ctrlFSelectionReducer(initialState, {
        type: FIND_UPDATED,
        payload: {
          selectedIndex: 1,
          maxIndex: 1,
          indexRanges: [{ startIndex: 0, endIndex: 1 }] as IndexRange[],
        } as CtrlFindUpdatePayload,
      })
    ).toEqual({
      selectedIndex: 0,
      maxIndex: 0,
      indexRanges: [{ startIndex: 0, endIndex: 1 }],
    });
  });

  it('should increment the selection state', () => {
    const initialState = {
      selectedIndex: 0,
      maxIndex: 1,
      indexRanges: [
        { startIndex: 0, endIndex: 1 },
        { startIndex: 1, endIndex: 2 },
      ] as IndexRange[],
    };
    expect(
      ctrlFSelectionReducer(initialState, {
        type: FIND_NEXT,
        payload: {
          selectedIndex: 0,
          maxIndex: 1,
          indexRanges: [{ startIndex: 0, endIndex: 1 }] as IndexRange[],
        } as CtrlFindUpdatePayload,
      })
    ).toEqual({
      selectedIndex: 1,
      maxIndex: 1,
      indexRanges: [
        { startIndex: 0, endIndex: 1 },
        { startIndex: 1, endIndex: 2 },
      ],
    });
  });

  it('should decrement the selection state', () => {
    const initialState = {
      selectedIndex: 0,
      maxIndex: 1,
      indexRanges: [
        { startIndex: 0, endIndex: 1 },
        { startIndex: 1, endIndex: 2 },
      ] as IndexRange[],
    };
    expect(
      ctrlFSelectionReducer(initialState, {
        type: FIND_PREV,
        payload: {
          selectedIndex: 1,
          maxIndex: 1,
          indexRanges: [{ startIndex: 0, endIndex: 1 }] as IndexRange[],
        } as CtrlFindUpdatePayload,
      })
    ).toEqual({
      selectedIndex: 1,
      maxIndex: 1,
      indexRanges: [
        { startIndex: 0, endIndex: 1 },
        { startIndex: 1, endIndex: 2 },
      ],
    });
  });

  it('should reset the selection state', () => {
    const initialState = {
      selectedIndex: 0,
      maxIndex: 1,
      indexRanges: [
        { startIndex: 0, endIndex: 1 },
        { startIndex: 1, endIndex: 2 },
      ] as IndexRange[],
    };
    expect(
      ctrlFSelectionReducer(initialState, {
        type: FIND_CLOSED,
        payload: {
          selectedIndex: 0,
          maxIndex: 0,
          indexRanges: [] as IndexRange[],
        } as CtrlFindUpdatePayload,
      })
    ).toEqual({
      selectedIndex: 0,
      maxIndex: 0,
      indexRanges: [],
    });
  });
});
