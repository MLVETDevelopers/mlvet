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
  text: string,
  isDeleted?: boolean,
  pasteCount?: number
) => Word = (text, isDeleted = false, pasteCount = 0) => ({
  word: text,
  startTime: 0,
  duration: 0,
  bufferDurationBefore: 0,
  bufferDurationAfter: 0,
  outputStartTime: 0,
  deleted: isDeleted,
  originalIndex: 0,
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
          words: [makeBasicWord('a')],
        },
      })
    ).toEqual({
      confidence: 1,
      words: [makeBasicWord('a')],
    });
  });

  it('should handle words being deleted', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord('b'),
          makeBasicWord('c'),
          makeBasicWord('d'),
          makeBasicWord('e'),
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
      makeBasicWord('a'),
      makeBasicWord('b', true),
      makeBasicWord('c', true),
      makeBasicWord('d'),
      makeBasicWord('e'),
    ]);
  });

  it('should handle deletions being undone', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord('b'),
          makeBasicWord('c', true),
          makeBasicWord('d', true),
          makeBasicWord('e', true),
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
      makeBasicWord('a'),
      makeBasicWord('b'),
      makeBasicWord('c'),
      makeBasicWord('d'),
      makeBasicWord('e'),
    ]);
  });

  it('should handle words being pasted', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord('b'),
          makeBasicWord('c', true),
          makeBasicWord('d', true),
          makeBasicWord('e', true),
        ],
      },
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboard: [
            makeBasicWord('f'),
            makeBasicWord('g'),
            makeBasicWord('h'),
          ],
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord('a'),
      makeBasicWord('b'),
      makeBasicWord('c', true),
      makeBasicWord('f', false, 1),
      makeBasicWord('g', false, 1),
      makeBasicWord('h', false, 1),
      makeBasicWord('d', true),
      makeBasicWord('e', true),
    ]);
  });

  it('should handle words that were already pasted, being pasted again', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord('b'),
          makeBasicWord('c', true),
          makeBasicWord('d', true),
          makeBasicWord('e', true),
          makeBasicWord('f'),
          makeBasicWord('g'),
          makeBasicWord('h'),
        ],
      },
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboard: [
            makeBasicWord('f'),
            makeBasicWord('g'),
            makeBasicWord('h'),
          ],
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord('a'),
      makeBasicWord('b'),
      makeBasicWord('c', true),
      makeBasicWord('f', false, 1),
      makeBasicWord('g', false, 1),
      makeBasicWord('h', false, 1),
      makeBasicWord('d', true),
      makeBasicWord('e', true),
      makeBasicWord('f'),
      makeBasicWord('g'),
      makeBasicWord('h'),
    ]);
  });

  it('should handle words being pasted even when some of the words on the clipboard were deleted', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord('b', true),
          makeBasicWord('c'),
          makeBasicWord('d'),
          makeBasicWord('e', true),
        ],
      },
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboard: [
            makeBasicWord('f'),
            makeBasicWord('g', true),
            makeBasicWord('h'),
          ],
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord('a'),
      makeBasicWord('b', true),
      makeBasicWord('c'),
      makeBasicWord('f', false, 1),
      makeBasicWord('g', true, 1),
      makeBasicWord('h', false, 1),
      makeBasicWord('d'),
      makeBasicWord('e', true),
    ]);
  });

  it('should handle words being pasted just after the start of the transcription', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord('b'),
          makeBasicWord('c'),
          makeBasicWord('d'),
          makeBasicWord('e'),
        ],
      },
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 0,
          clipboard: [
            makeBasicWord('f'),
            makeBasicWord('g'),
            makeBasicWord('h'),
          ],
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord('a'),
      makeBasicWord('f', false, 1),
      makeBasicWord('g', false, 1),
      makeBasicWord('h', false, 1),
      makeBasicWord('b'),
      makeBasicWord('c'),
      makeBasicWord('d'),
      makeBasicWord('e'),
    ]);
  });

  it('should handle words being pasted to the end of the transcription', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord('b'),
          makeBasicWord('c'),
          makeBasicWord('d'),
          makeBasicWord('e'),
        ],
      },
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 4,
          clipboard: [
            makeBasicWord('f'),
            makeBasicWord('g'),
            makeBasicWord('h'),
          ],
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord('a'),
      makeBasicWord('b'),
      makeBasicWord('c'),
      makeBasicWord('d'),
      makeBasicWord('e'),
      makeBasicWord('f', false, 1),
      makeBasicWord('g', false, 1),
      makeBasicWord('h', false, 1),
    ]);
  });

  it('should handle a paste being undone', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord('b'),
          makeBasicWord('c', false, 1),
          makeBasicWord('d', false, 1),
          makeBasicWord('e'),
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
      makeBasicWord('a'),
      makeBasicWord('b'),
      makeBasicWord('e'),
    ]);
  });

  it('should handle a paste being undone with various words deleted', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a', true),
          makeBasicWord('b', false, 1),
          makeBasicWord('c', true, 1),
          makeBasicWord('d', true),
          makeBasicWord('e'),
        ],
      },
      {
        type: UNDO_PASTE_WORD,
        payload: {
          startIndex: 0,
          clipboardLength: 2,
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(output?.words).toEqual([
      makeBasicWord('a', true),
      makeBasicWord('d', true),
      makeBasicWord('e'),
    ]);
  });
});
