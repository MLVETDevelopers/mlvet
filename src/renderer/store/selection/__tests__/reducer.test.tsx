import { emptyRange } from 'renderer/utils/range';
import { makeSelfSelection } from 'sharedUtils';
import { IndexRange } from '../../../../sharedTypes';
import { selectionCleared, selectionRangeSetTo } from '../actions';
import selectionReducer from '../reducer';

describe('Selection reducer', () => {
  it('should successfully clear selection', () => {
    const initialSelection = makeSelfSelection({ startIndex: 0, endIndex: 4 });

    const newSelection = selectionReducer(initialSelection, selectionCleared());

    expect(newSelection.self).toEqual(emptyRange());
  });

  it('should successfully set a selection to a given range', () => {
    const initialSelection = makeSelfSelection({ startIndex: 0, endIndex: 10 });

    const newRange: IndexRange = {
      startIndex: 2,
      endIndex: 8,
    };

    const newSelection = selectionReducer(
      initialSelection,
      selectionRangeSetTo(newRange)
    );

    expect(newSelection.self).toEqual({ startIndex: 2, endIndex: 8 });
  });
});
