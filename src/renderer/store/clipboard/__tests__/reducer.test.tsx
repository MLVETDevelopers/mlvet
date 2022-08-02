import { CLIPBOARD_UPDATED } from '../actions';
import clipboardReducer from '../reducer';

describe('Clipboard reducer', () => {
  it('should handle clipboard updated', () => {
    expect(
      clipboardReducer(
        { startIndex: 0, endIndex: 1 },
        {
          type: CLIPBOARD_UPDATED,
          payload: {
            startIndex: 5,
            endIndex: 6,
          },
        }
      )
    ).toEqual({
      startIndex: 5,
      endIndex: 6,
    });
  });
});
