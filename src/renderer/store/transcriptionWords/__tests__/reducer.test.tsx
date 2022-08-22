import { WordComponent } from 'sharedTypes';
import {
  DELETE_SELECTION,
  PASTE_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_PASTE_WORD,
} from '../actions';
import transcriptionWordsReducer from '../reducer';

const makeBasicWord: (
  originalIndex: number,
  text: string,
  isDeleted?: boolean,
  pasteKey?: number
) => WordComponent = (
  originalIndex,
  text,
  isDeleted = false,
  pasteKey = 0
) => ({
  word: text,
  startTime: 0,
  duration: 0,
  bufferDurationBefore: 0,
  bufferDurationAfter: 0,
  outputStartTime: 0,
  deleted: isDeleted,
  originalIndex,
  pasteKey,
  fileName: 'PLACEHOLDER FILENAME',
});

describe('Transcription words reducer', () => {
  it('should handle words being deleted', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWord(0, 'a'),
        makeBasicWord(1, 'b'),
        makeBasicWord(2, 'c'),
        makeBasicWord(3, 'd'),
        makeBasicWord(4, 'e'),
      ],
      {
        type: DELETE_SELECTION,
        payload: {
          ranges: [
            {
              startIndex: 1,
              endIndex: 3,
            },
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b', true),
      makeBasicWord(2, 'c', true),
      makeBasicWord(3, 'd'),
      makeBasicWord(4, 'e'),
    ]);
  });

  it('should handle deletions being undone', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWord(0, 'a'),
        makeBasicWord(1, 'b'),
        makeBasicWord(2, 'c', true),
        makeBasicWord(3, 'd', true),
        makeBasicWord(4, 'e', true),
      ],
      {
        type: UNDO_DELETE_SELECTION,
        payload: {
          ranges: [
            {
              startIndex: 2,
              endIndex: 5,
            },
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b'),
      makeBasicWord(2, 'c'),
      makeBasicWord(3, 'd'),
      makeBasicWord(4, 'e'),
    ]);
  });

  it('should handle deletions for non-contiguous ranges', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWord(0, 'a'),
        makeBasicWord(1, 'b'),
        makeBasicWord(2, 'c'),
        makeBasicWord(3, 'd'),
        makeBasicWord(4, 'e'),
      ],
      {
        type: DELETE_SELECTION,
        payload: {
          ranges: [
            {
              startIndex: 0,
              endIndex: 2,
            },
            {
              startIndex: 3,
              endIndex: 4,
            },
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWord(0, 'a', true),
      makeBasicWord(1, 'b', true),
      makeBasicWord(2, 'c'),
      makeBasicWord(3, 'd', true),
      makeBasicWord(4, 'e'),
    ]);
  });

  it('should handle deletions being undone for non-contiguous ranges', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWord(0, 'a', true),
        makeBasicWord(1, 'b', true),
        makeBasicWord(2, 'c'),
        makeBasicWord(3, 'd', true),
        makeBasicWord(4, 'e', true),
      ],
      {
        type: UNDO_DELETE_SELECTION,
        payload: {
          ranges: [
            {
              startIndex: 0,
              endIndex: 1,
            },
            {
              startIndex: 3,
              endIndex: 5,
            },
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b', true),
      makeBasicWord(2, 'c'),
      makeBasicWord(3, 'd'),
      makeBasicWord(4, 'e'),
    ]);
  });

  it('should handle words being pasted', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWord(0, 'a'),
        makeBasicWord(1, 'b'),
        makeBasicWord(2, 'c', true),
        makeBasicWord(3, 'd', true),
        makeBasicWord(4, 'e', true),
        makeBasicWord(5, 'f', true),
        makeBasicWord(6, 'g', true),
        makeBasicWord(7, 'h', true),
      ],
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboard: [
            makeBasicWord(5, 'f'),
            makeBasicWord(6, 'g'),
            makeBasicWord(7, 'h'),
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b'),
      makeBasicWord(2, 'c', true),
      makeBasicWord(5, 'f', false, 1),
      makeBasicWord(6, 'g', false, 2),
      makeBasicWord(7, 'h', false, 3),
      makeBasicWord(3, 'd', true),
      makeBasicWord(4, 'e', true),
      makeBasicWord(5, 'f', true),
      makeBasicWord(6, 'g', true),
      makeBasicWord(7, 'h', true),
    ]);
  });

  it('should handle words that were already pasted, being pasted again', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWord(0, 'a'),
        makeBasicWord(1, 'b'),
        makeBasicWord(2, 'c', true),
        makeBasicWord(3, 'd', true),
        makeBasicWord(4, 'e', true),
        makeBasicWord(5, 'f'),
        makeBasicWord(6, 'g'),
        makeBasicWord(7, 'h'),
        makeBasicWord(5, 'f', false, 1),
        makeBasicWord(6, 'g', false, 2),
        makeBasicWord(7, 'h', false, 3),
      ],
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboard: [
            makeBasicWord(5, 'f'),
            makeBasicWord(6, 'g'),
            makeBasicWord(7, 'h'),
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b'),
      makeBasicWord(2, 'c', true),
      makeBasicWord(5, 'f', false, 4),
      makeBasicWord(6, 'g', false, 5),
      makeBasicWord(7, 'h', false, 6),
      makeBasicWord(3, 'd', true),
      makeBasicWord(4, 'e', true),
      makeBasicWord(5, 'f'),
      makeBasicWord(6, 'g'),
      makeBasicWord(7, 'h'),
      makeBasicWord(5, 'f', false, 1),
      makeBasicWord(6, 'g', false, 2),
      makeBasicWord(7, 'h', false, 3),
    ]);
  });

  it('should handle words being pasted even when some of the words on the clipboard were deleted', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWord(0, 'a'),
        makeBasicWord(1, 'b', true),
        makeBasicWord(2, 'c'),
        makeBasicWord(3, 'd'),
        makeBasicWord(4, 'e', true),
        makeBasicWord(5, 'f', true),
        makeBasicWord(6, 'g', true),
        makeBasicWord(7, 'h', true),
      ],
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboard: [
            makeBasicWord(5, 'f'),
            makeBasicWord(6, 'g', true),
            makeBasicWord(7, 'h'),
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b', true),
      makeBasicWord(2, 'c'),
      makeBasicWord(5, 'f', false, 1),
      makeBasicWord(6, 'g', true, 2),
      makeBasicWord(7, 'h', false, 3),
      makeBasicWord(3, 'd'),
      makeBasicWord(4, 'e', true),
      makeBasicWord(5, 'f', true),
      makeBasicWord(6, 'g', true),
      makeBasicWord(7, 'h', true),
    ]);
  });

  it('should handle words being pasted just after the start of the transcription', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWord(0, 'a'),
        makeBasicWord(1, 'b'),
        makeBasicWord(2, 'c'),
        makeBasicWord(3, 'd'),
        makeBasicWord(4, 'e'),
        makeBasicWord(5, 'f', true),
        makeBasicWord(6, 'g', true),
        makeBasicWord(7, 'h', true),
      ],
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 0,
          clipboard: [
            makeBasicWord(5, 'f'),
            makeBasicWord(6, 'g'),
            makeBasicWord(7, 'h'),
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(5, 'f', false, 1),
      makeBasicWord(6, 'g', false, 2),
      makeBasicWord(7, 'h', false, 3),
      makeBasicWord(1, 'b'),
      makeBasicWord(2, 'c'),
      makeBasicWord(3, 'd'),
      makeBasicWord(4, 'e'),
      makeBasicWord(5, 'f', true),
      makeBasicWord(6, 'g', true),
      makeBasicWord(7, 'h', true),
    ]);
  });

  it('should handle words being pasted to the end of the transcription', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWord(0, 'a'),
        makeBasicWord(1, 'b'),
        makeBasicWord(2, 'c'),
        makeBasicWord(3, 'd', true),
        makeBasicWord(4, 'e', true),
        makeBasicWord(5, 'f', true),
        makeBasicWord(6, 'g'),
        makeBasicWord(7, 'h'),
      ],
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 7,
          clipboard: [
            makeBasicWord(3, 'd'),
            makeBasicWord(4, 'e'),
            makeBasicWord(5, 'f'),
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b'),
      makeBasicWord(2, 'c'),
      makeBasicWord(3, 'd', true),
      makeBasicWord(4, 'e', true),
      makeBasicWord(5, 'f', true),
      makeBasicWord(6, 'g'),
      makeBasicWord(7, 'h'),
      makeBasicWord(3, 'd', false, 1),
      makeBasicWord(4, 'e', false, 2),
      makeBasicWord(5, 'f', false, 3),
    ]);
  });

  it('should handle a paste being undone', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWord(0, 'a'),
        makeBasicWord(1, 'b'),
        makeBasicWord(2, 'c', false, 1),
        makeBasicWord(3, 'd', false, 2),
        makeBasicWord(2, 'c'),
        makeBasicWord(3, 'd'),
        makeBasicWord(4, 'e'),
      ],
      {
        type: UNDO_PASTE_WORD,
        payload: {
          startIndex: 1,
          clipboardLength: 2,
        },
      }
    );

    expect(output).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b'),
      makeBasicWord(2, 'c'),
      makeBasicWord(3, 'd'),
      makeBasicWord(4, 'e'),
    ]);
  });

  it('should handle a paste being undone with various words deleted', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWord(0, 'a', true),
        makeBasicWord(1, 'b'),
        makeBasicWord(2, 'c', true, 1),
        makeBasicWord(3, 'd', false, 2),
        makeBasicWord(2, 'c', true),
        makeBasicWord(3, 'd'),
        makeBasicWord(4, 'e'),
      ],
      {
        type: UNDO_PASTE_WORD,
        payload: {
          startIndex: 1,
          clipboardLength: 2,
        },
      }
    );

    expect(output).toEqual([
      makeBasicWord(0, 'a', true),
      makeBasicWord(1, 'b'),
      makeBasicWord(2, 'c', true),
      makeBasicWord(3, 'd'),
      makeBasicWord(4, 'e'),
    ]);
  });

  it('should handle a paste of multiple words with the same original index', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWord(0, 'a'),
        makeBasicWord(0, 'a', false, 1),
        makeBasicWord(1, 'b'),
      ],
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboard: [makeBasicWord(0, 'a'), makeBasicWord(0, 'a', false, 1)],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(0, 'a', false, 1),
      makeBasicWord(1, 'b'),
      makeBasicWord(0, 'a', false, 2),
      makeBasicWord(0, 'a', false, 3),
    ]);
  });
});
