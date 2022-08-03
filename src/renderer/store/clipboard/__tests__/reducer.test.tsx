import { CLIPBOARD_UPDATED } from '../actions';
import clipboardReducer from '../reducer';

describe('Clipboard reducer', () => {
  it('should handle clipboard updated', () => {
    expect(
      clipboardReducer([], {
        type: CLIPBOARD_UPDATED,
        payload: [
          {
            word: ' ',
            startTime: 0,
            duration: 0,
            outputStartTime: 0,
            deleted: false,
            key: '0',
            fileName: 'PLACEHOLDER FILENAME',
          },
          {
            word: 'Abc.',
            duration: 1,
            startTime: 0,
            outputStartTime: 0,
            key: '1',
            deleted: false,
            fileName: 'PLACEHOLDER FILENAME',
          },
        ],
      })
    ).toEqual([
      {
        word: ' ',
        startTime: 0,
        duration: 0,
        outputStartTime: 0,
        deleted: false,
        key: '0',
        fileName: 'PLACEHOLDER FILENAME',
      },
      {
        word: 'Abc.',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        key: '1',
        deleted: false,
        fileName: 'PLACEHOLDER FILENAME',
      },
    ]);
  });
});
