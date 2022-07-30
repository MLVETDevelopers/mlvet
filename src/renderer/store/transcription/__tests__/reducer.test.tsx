import {
  DELETE_WORD,
  PASTE_WORD,
  UNDO_DELETE_WORD,
  UNDO_PASTE_WORD,
} from 'renderer/store/undoStack/ops';
import { Word } from 'sharedTypes';
import { TRANSCRIPTION_CREATED } from '../actions';
import transcriptionReducer from '../reducer';

const makeBasicWord: (
  originalIndex: number,
  text: string,
  isDeleted?: boolean,
  pasteCount?: number
) => Word = (originalIndex, text, isDeleted = false, pasteCount = 0) => ({
  word: text,
  startTime: 0,
  duration: 0,
  bufferDurationBefore: 0,
  bufferDurationAfter: 0,
  outputStartTime: 0,
  deleted: isDeleted,
  originalIndex,
  pasteCount,
  fileName: 'PLACEHOLDER FILENAME',
});

describe('Transcription reducer', () => {
  it('should handle transcription created', () => {
    expect(
      transcriptionReducer(null, {
        type: TRANSCRIPTION_CREATED,
        payload: {
          confidence: 1,
          words: [makeBasicWord(0, 'a')],
        },
      })
    ).toEqual({
      confidence: 1,
      words: [makeBasicWord(0, 'a')],
    });
  });

  it('should handle words being deleted', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord(0, 'a'),
          makeBasicWord(1, 'b'),
          makeBasicWord(2, 'c'),
          makeBasicWord(3, 'd'),
          makeBasicWord(4, 'e'),
        ],
      },
      {
        type: DELETE_WORD,
        payload: {
          startIndex: 1,
          endIndex: 3,
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b', true),
      makeBasicWord(2, 'c', true),
      makeBasicWord(3, 'd'),
      makeBasicWord(4, 'e'),
    ]);
  });

  it('should handle deletions being undone', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord(0, 'a'),
          makeBasicWord(1, 'b'),
          makeBasicWord(2, 'c', true),
          makeBasicWord(3, 'd', true),
          makeBasicWord(4, 'e', true),
        ],
      },
      {
        type: UNDO_DELETE_WORD,
        payload: {
          startIndex: 2,
          endIndex: 5,
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b'),
      makeBasicWord(2, 'c'),
      makeBasicWord(3, 'd'),
      makeBasicWord(4, 'e'),
    ]);
  });

  it('should handle words being pasted', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord(0, 'a'),
          makeBasicWord(1, 'b'),
          makeBasicWord(2, 'c', true),
          makeBasicWord(3, 'd', true),
          makeBasicWord(4, 'e', true),
          makeBasicWord(5, 'f', true),
          makeBasicWord(6, 'g', true),
          makeBasicWord(7, 'h', true),
        ],
      },
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

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b'),
      makeBasicWord(2, 'c', true),
      makeBasicWord(5, 'f', false, 1),
      makeBasicWord(6, 'g', false, 1),
      makeBasicWord(7, 'h', false, 1),
      makeBasicWord(3, 'd', true),
      makeBasicWord(4, 'e', true),
      makeBasicWord(5, 'f', true),
      makeBasicWord(6, 'g', true),
      makeBasicWord(7, 'h', true),
    ]);
  });

  it('should handle words that were already pasted, being pasted again', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord(0, 'a'),
          makeBasicWord(1, 'b'),
          makeBasicWord(2, 'c', true),
          makeBasicWord(3, 'd', true),
          makeBasicWord(4, 'e', true),
          makeBasicWord(5, 'f'),
          makeBasicWord(6, 'g'),
          makeBasicWord(7, 'h'),
          makeBasicWord(5, 'f', false, 1),
          makeBasicWord(6, 'g', false, 1),
          makeBasicWord(7, 'h', false, 1),
        ],
      },
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

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b'),
      makeBasicWord(2, 'c', true),
      makeBasicWord(5, 'f', false, 2),
      makeBasicWord(6, 'g', false, 2),
      makeBasicWord(7, 'h', false, 2),
      makeBasicWord(3, 'd', true),
      makeBasicWord(4, 'e', true),
      makeBasicWord(5, 'f'),
      makeBasicWord(6, 'g'),
      makeBasicWord(7, 'h'),
      makeBasicWord(5, 'f', false, 1),
      makeBasicWord(6, 'g', false, 1),
      makeBasicWord(7, 'h', false, 1),
    ]);
  });

  it('should handle words being pasted even when some of the words on the clipboard were deleted', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord(0, 'a'),
          makeBasicWord(1, 'b', true),
          makeBasicWord(2, 'c'),
          makeBasicWord(3, 'd'),
          makeBasicWord(4, 'e', true),
          makeBasicWord(5, 'f', true),
          makeBasicWord(6, 'g', true),
          makeBasicWord(7, 'h', true),
        ],
      },
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

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b', true),
      makeBasicWord(2, 'c'),
      makeBasicWord(5, 'f', false, 1),
      makeBasicWord(6, 'g', true, 1),
      makeBasicWord(7, 'h', false, 1),
      makeBasicWord(3, 'd'),
      makeBasicWord(4, 'e', true),
      makeBasicWord(5, 'f', true),
      makeBasicWord(6, 'g', true),
      makeBasicWord(7, 'h', true),
    ]);
  });

  it('should handle words being pasted just after the start of the transcription', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord(0, 'a'),
          makeBasicWord(1, 'b'),
          makeBasicWord(2, 'c'),
          makeBasicWord(3, 'd'),
          makeBasicWord(4, 'e'),
          makeBasicWord(5, 'f', true),
          makeBasicWord(6, 'g', true),
          makeBasicWord(7, 'h', true),
        ],
      },
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

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(5, 'f', false, 1),
      makeBasicWord(6, 'g', false, 1),
      makeBasicWord(7, 'h', false, 1),
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
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord(0, 'a'),
          makeBasicWord(1, 'b'),
          makeBasicWord(2, 'c'),
          makeBasicWord(3, 'd', true),
          makeBasicWord(4, 'e', true),
          makeBasicWord(5, 'f', true),
          makeBasicWord(6, 'g'),
          makeBasicWord(7, 'h'),
        ],
      },
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

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b'),
      makeBasicWord(2, 'c'),
      makeBasicWord(3, 'd', true),
      makeBasicWord(4, 'e', true),
      makeBasicWord(5, 'f', true),
      makeBasicWord(6, 'g'),
      makeBasicWord(7, 'h'),
      makeBasicWord(3, 'd', false, 1),
      makeBasicWord(4, 'e', false, 1),
      makeBasicWord(5, 'f', false, 1),
    ]);
  });

  it('should handle a paste being undone', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord(0, 'a'),
          makeBasicWord(1, 'b'),
          makeBasicWord(2, 'c', false, 1),
          makeBasicWord(3, 'd', false, 1),
          makeBasicWord(2, 'c'),
          makeBasicWord(3, 'd'),
          makeBasicWord(4, 'e'),
        ],
      },
      {
        type: UNDO_PASTE_WORD,
        payload: {
          startIndex: 1,
          clipboardLength: 2,
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b'),
      makeBasicWord(2, 'c'),
      makeBasicWord(3, 'd'),
      makeBasicWord(4, 'e'),
    ]);
  });

  it('should handle a paste being undone with various words deleted', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord(0, 'a', true),
          makeBasicWord(1, 'b'),
          makeBasicWord(2, 'c', true, 1),
          makeBasicWord(3, 'd', false, 1),
          makeBasicWord(2, 'c', true),
          makeBasicWord(3, 'd'),
          makeBasicWord(4, 'e'),
        ],
      },
      {
        type: UNDO_PASTE_WORD,
        payload: {
          startIndex: 1,
          clipboardLength: 2,
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord(0, 'a', true),
      makeBasicWord(1, 'b'),
      makeBasicWord(2, 'c', true),
      makeBasicWord(3, 'd'),
      makeBasicWord(4, 'e'),
    ]);
  });

  it('should handle a paste of multiple words with the same original index', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord(0, 'a'),
          makeBasicWord(0, 'a', false, 1),
          makeBasicWord(1, 'b'),
        ],
      },
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboard: [makeBasicWord(0, 'a'), makeBasicWord(0, 'a', false, 1)],
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(0, 'a', false, 1),
      makeBasicWord(1, 'b'),
      makeBasicWord(0, 'a', false, 2),
      makeBasicWord(0, 'a', false, 3),
    ]);
  });
});