import { SELECTION_RANGE_ADDED } from 'renderer/store/selection/actions';
import { expandSelectionToWord, getSelectionRanges } from '../editor/selection';
import {
  ApplicationStore,
  initialStore,
  SelectionIndices,
  SelectionState,
} from '../store/sharedHelpers';
import store from '../store/store';

jest.mock('../store/store');
const getStateMock = store.getState as unknown as jest.Mock<ApplicationStore>;

const dispatchSpy = jest.spyOn(store, 'dispatch');

const makeSelfSelection: (selection: SelectionIndices) => SelectionState = (
  selection
) => ({
  self: selection,
  others: {},
});

describe('getSelectionRanges', () => {
  it('should return empty list of ranges when selection is empty', () => {
    getStateMock.mockReturnValue({
      ...initialStore,
      selection: makeSelfSelection([]),
    });

    const ranges = getSelectionRanges();

    expect(ranges).toEqual([]);
  });

  it('should return a single range when selection is a contiguous range', () => {
    getStateMock.mockReturnValue({
      ...initialStore,
      selection: makeSelfSelection([5, 6, 7, 8]),
    });

    const ranges = getSelectionRanges();

    expect(ranges).toEqual([{ startIndex: 5, endIndex: 9 }]);
  });

  it('should return a single range when selection is a single value', () => {
    getStateMock.mockReturnValue({
      ...initialStore,
      selection: makeSelfSelection([21]),
    });

    const ranges = getSelectionRanges();

    expect(ranges).toEqual([{ startIndex: 21, endIndex: 22 }]);
  });

  it('should return multiple ranges when selection is non-contiguous', () => {
    getStateMock.mockReturnValue({
      ...initialStore,
      selection: makeSelfSelection([5, 6, 7, 8, 11, 12, 56, 81, 82]),
    });

    const ranges = getSelectionRanges();

    expect(ranges).toEqual([
      { startIndex: 5, endIndex: 9 },
      { startIndex: 11, endIndex: 13 },
      { startIndex: 56, endIndex: 57 },
      { startIndex: 81, endIndex: 83 },
    ]);
  });

  it('should work as expected even when selection is out of order', () => {
    getStateMock.mockReturnValue({
      ...initialStore,
      selection: makeSelfSelection([5, 8, 82, 81, 11, 12, 56, 6, 7]),
    });

    const ranges = getSelectionRanges();

    expect(ranges).toEqual([
      { startIndex: 5, endIndex: 9 },
      { startIndex: 11, endIndex: 13 },
      { startIndex: 56, endIndex: 57 },
      { startIndex: 81, endIndex: 83 },
    ]);
  });
});

describe('expandSelectionToWord', () => {
  it('should do nothing when word is already selected', () => {
    getStateMock.mockReturnValue({
      ...initialStore,
      selection: makeSelfSelection([1]),
    });

    expandSelectionToWord(1);

    expect(dispatchSpy).toBeCalledTimes(0);
  });

  it('should select word normally when selection is empty', () => {
    getStateMock.mockReturnValue({
      ...initialStore,
      selection: makeSelfSelection([]),
    });

    expandSelectionToWord(1);

    expect(dispatchSpy).toBeCalledWith({
      type: SELECTION_RANGE_ADDED,
      payload: { range: { startIndex: 1, endIndex: 2 }, clientId: null },
    });
  });

  it('should expand selection to left when word is to the left of selection', () => {
    getStateMock.mockReturnValue({
      ...initialStore,
      selection: makeSelfSelection([4, 5, 6, 9, 10, 52]),
    });

    expandSelectionToWord(1);

    expect(dispatchSpy).toBeCalledWith({
      type: SELECTION_RANGE_ADDED,
      payload: { range: { startIndex: 1, endIndex: 4 }, clientId: null },
    });
  });

  it('should expand selection to right when word is to the right of selection', () => {
    getStateMock.mockReturnValue({
      ...initialStore,
      selection: makeSelfSelection([4, 5, 6, 9, 10, 52]),
    });

    expandSelectionToWord(68);

    expect(dispatchSpy).toBeCalledWith({
      type: SELECTION_RANGE_ADDED,
      payload: { range: { startIndex: 53, endIndex: 69 }, clientId: null },
    });
  });

  it('should "paint fill" selection in middle when word is between existing selected words', () => {
    getStateMock.mockReturnValue({
      ...initialStore,
      selection: makeSelfSelection([4, 5, 12, 13, 14, 15, 52]),
    });

    expandSelectionToWord(8);

    expect(dispatchSpy).toBeCalledWith({
      type: SELECTION_RANGE_ADDED,
      payload: { range: { startIndex: 6, endIndex: 12 }, clientId: null },
    });
  });

  it('should "paint fill" selection when word is the only word between existing selected words', () => {
    getStateMock.mockReturnValue({
      ...initialStore,
      selection: makeSelfSelection([4, 5, 10, 12, 13, 14, 15, 52]),
    });

    expandSelectionToWord(11);

    expect(dispatchSpy).toBeCalledWith({
      type: SELECTION_RANGE_ADDED,
      payload: { range: { startIndex: 11, endIndex: 12 }, clientId: null },
    });
  });

  it('should "paint fill" selection when word is the leftmost word between existing selected words', () => {
    getStateMock.mockReturnValue({
      ...initialStore,
      selection: makeSelfSelection([4, 5, 10, 12, 13, 14, 15, 52]),
    });

    expandSelectionToWord(16);

    expect(dispatchSpy).toBeCalledWith({
      type: SELECTION_RANGE_ADDED,
      payload: { range: { startIndex: 16, endIndex: 52 }, clientId: null },
    });
  });

  it('should "paint fill" selection when word is the rightmost word between existing selected words', () => {
    getStateMock.mockReturnValue({
      ...initialStore,
      selection: makeSelfSelection([4, 5, 10, 12, 13, 14, 15, 52]),
    });

    expandSelectionToWord(51);

    expect(dispatchSpy).toBeCalledWith({
      type: SELECTION_RANGE_ADDED,
      payload: { range: { startIndex: 16, endIndex: 52 }, clientId: null },
    });
  });
});
