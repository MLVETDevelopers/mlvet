import {
  DELETE_SELECTION,
  PASTE_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_PASTE_WORD,
} from 'renderer/store/undoStack/ops';
import { Word } from 'sharedTypes';
import { TRANSCRIPTION_CREATED } from '../actions';
import transcriptionReducer from '../reducer';

const makeBasicWord: (
  originalIndex: number,
  text: string,
  isDeleted?: boolean,
  pasteKey?: number,
  startTime?: number,
  outputStartTime?: number,
  outputDuration?: number,
  bufferDurationBefore?: number
) => Word = (
  originalIndex,
  text,
  isDeleted = false,
  pasteKey = 0,
  startTime = 0,
  outputStartTime = 0,
  duration = 0,
  bufferDurationAfter = 0
) => ({
  word: text,
  startTime,
  duration,
  bufferDurationBefore: 0,
  bufferDurationAfter,
  outputStartTime,
  deleted: isDeleted,
  originalIndex,
  pasteKey,
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
        outputDuration: 100,
        words: [
          makeBasicWord(0, 'a'),
          makeBasicWord(1, 'b'),
          makeBasicWord(2, 'c'),
          makeBasicWord(3, 'd'),
          makeBasicWord(4, 'e'),
        ],
      },
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
        outputDuration: 100,
        words: [
          makeBasicWord(0, 'a'),
          makeBasicWord(1, 'b'),
          makeBasicWord(2, 'c', true),
          makeBasicWord(3, 'd', true),
          makeBasicWord(4, 'e', true),
        ],
      },
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

  it('should handle deletions for non-contiguous ranges', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        outputDuration: 100,
        words: [
          makeBasicWord(0, 'a'),
          makeBasicWord(1, 'b'),
          makeBasicWord(2, 'c'),
          makeBasicWord(3, 'd'),
          makeBasicWord(4, 'e'),
        ],
      },
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

    expect(output?.words).toEqual([
      makeBasicWord(0, 'a', true),
      makeBasicWord(1, 'b', true),
      makeBasicWord(2, 'c'),
      makeBasicWord(3, 'd', true),
      makeBasicWord(4, 'e'),
    ]);
  });

  it('should handle deletions being undone for non-contiguous ranges', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        outputDuration: 100,
        words: [
          makeBasicWord(0, 'a', true),
          makeBasicWord(1, 'b', true),
          makeBasicWord(2, 'c'),
          makeBasicWord(3, 'd', true),
          makeBasicWord(4, 'e', true),
        ],
      },
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

    expect(output?.words).toEqual([
      makeBasicWord(0, 'a'),
      makeBasicWord(1, 'b', true),
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
        outputDuration: 100,
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
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        outputDuration: 100,
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
          makeBasicWord(6, 'g', false, 2),
          makeBasicWord(7, 'h', false, 3),
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
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        outputDuration: 100,
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
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        outputDuration: 100,
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
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        outputDuration: 100,
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
      makeBasicWord(4, 'e', false, 2),
      makeBasicWord(5, 'f', false, 3),
    ]);
  });

  it('should handle a paste being undone', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        outputDuration: 100,
        words: [
          makeBasicWord(0, 'a'),
          makeBasicWord(1, 'b'),
          makeBasicWord(2, 'c', false, 1),
          makeBasicWord(3, 'd', false, 2),
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
        outputDuration: 100,
        words: [
          makeBasicWord(0, 'a', true),
          makeBasicWord(1, 'b'),
          makeBasicWord(2, 'c', true, 1),
          makeBasicWord(3, 'd', false, 2),
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
        outputDuration: 100,
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

  it('output start time should be updated after deleting words', () => {
    const transcript = {
      confidence: 1,
      duration: 7.84,
      outputDuration: 7.84,
      words: [
        makeBasicWord(0, 'a', undefined, undefined, 0, 0, 1, 0.5),
        makeBasicWord(0, 'a', undefined, undefined, 1.5, 1.5, 0.7, 0.2),
        makeBasicWord(0, 'a', undefined, undefined, 2.4, 2.4, 1.3, 0.9),
        makeBasicWord(0, 'a', undefined, undefined, 4.6, 4.6, 0.24, 3),
      ],
    };

    const deleteOutput = transcriptionReducer(transcript, {
      type: DELETE_SELECTION,
      payload: {
        ranges: [
          {
            startIndex: 1,
            endIndex: 3,
          },
        ],
      },
    });

    // expect duration to remain the same and outputDuration to be updated
    expect(deleteOutput?.duration).toEqual(7.84);
    expect(deleteOutput?.outputDuration).toEqual(4.74);

    expect(deleteOutput?.words).toEqual([
      makeBasicWord(0, 'a', false, undefined, 0, 0, 1, 0.5),
      makeBasicWord(0, 'a', true, undefined, 1.5, 0, 0.7, 0.2),
      makeBasicWord(0, 'a', true, undefined, 2.4, 0, 1.3, 0.9),
      makeBasicWord(0, 'a', false, undefined, 4.6, 1.5, 0.24, 3),
    ]);
  });

  it('output start time should be the same as original when deleting and straight after undoing delete', () => {
    const transcript = {
      confidence: 1,
      duration: 7.84,
      outputDuration: 7.84,
      words: [
        makeBasicWord(0, 'a', undefined, undefined, 0, 0, 1, 0.5),
        makeBasicWord(0, 'a', undefined, undefined, 1.5, 1.5, 0.7, 0.2),
        makeBasicWord(0, 'a', undefined, undefined, 2.4, 2.4, 1.3, 0.9),
        makeBasicWord(0, 'a', undefined, undefined, 4.6, 4.6, 0.24, 3),
      ],
    };

    transcriptionReducer(transcript, {
      type: DELETE_SELECTION,
      payload: {
        ranges: [
          {
            startIndex: 1,
            endIndex: 3,
          },
        ],
      },
    });

    const undoOutput = transcriptionReducer(transcript, {
      type: UNDO_DELETE_SELECTION,
      payload: {
        ranges: [
          {
            startIndex: 1,
            endIndex: 3,
          },
        ],
      },
    });

    expect(undoOutput?.duration).toEqual(transcript.duration);
    expect(undoOutput?.outputDuration).toEqual(transcript.outputDuration);
    expect(undoOutput?.words).toEqual(transcript.words);
  });
});
