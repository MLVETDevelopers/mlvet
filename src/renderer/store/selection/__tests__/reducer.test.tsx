import { IndexRange } from '../../../../sharedTypes';
import {
  selectionCleared,
  selectionRangeAdded,
  selectionRangeRemoved,
  selectionRangeToggled,
} from '../actions';
import selectionReducer from '../reducer';

describe('Selection reducer', () => {
  it('should successfully clear selection', () => {
    const initialSelection = [0, 1, 2, 3];

    const newSelection = selectionReducer(initialSelection, selectionCleared());

    expect(newSelection).toEqual([]);
  });

  it('should successfully add new range to selection', () => {
    const initialSelection = [0, 1, 2, 3];

    const newRange: IndexRange = {
      startIndex: 6,
      endIndex: 10,
    };

    const newSelection = selectionReducer(
      initialSelection,
      selectionRangeAdded(newRange)
    );

    expect(newSelection.sort()).toEqual([0, 1, 2, 3, 6, 7, 8, 9]);
  });

  it('should successfully remove a range from selection', () => {
    const initialSelection = [0, 1, 2, 3, 4];

    const removeRange: IndexRange = {
      startIndex: 2,
      endIndex: 4,
    };

    const newSelection = selectionReducer(
      initialSelection,
      selectionRangeRemoved(removeRange)
    );

    expect(newSelection.sort()).toEqual([0, 1, 4]);
  });

  it('should successfully toggle a range in selection', () => {
    const initialSelection = [0, 1, 2, 3, 6, 7, 8, 9];

    const removeRange: IndexRange = {
      startIndex: 2,
      endIndex: 8,
    };

    const newSelection = selectionReducer(
      initialSelection,
      selectionRangeToggled(removeRange)
    );

    expect(newSelection.sort()).toEqual([0, 1, 4, 5, 8, 9]);
  });
});
