import {
  DELETE_WORD,
  PASTE_WORD,
  UNDO_DELETE_WORD,
  UNDO_PASTE_WORD,
} from 'renderer/store/undoStack/ops';
import { Transcription, Word } from 'sharedTypes';
import { TRANSCRIPTION_CREATED } from '../actions';
import transcriptionReducer from '../reducer';

const makeBasicWord: (text: string, isDeleted?: boolean) => Word = (
  text,
  isDeleted = false
) => ({
  word: text,
  startTime: 0,
  duration: 0,
  outputStartTime: 0,
  deleted: isDeleted,
  key: text,
  fileName: 'PLACEHOLDER FILENAME',
});

const expectAllEvenIndexWordsToBeSpaces: (
  output: Transcription | null
) => void = (output) => {
  expect(
    output?.words
      .filter((_, i) => i % 2 === 0)
      .every((word) => word.word === ' ')
  ).toBe(true);
};

const wordsWithoutSpaces: (
  output: Transcription | null
) => Word[] | undefined = (output) =>
  output?.words.filter((word) => word.word !== ' ');

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
          makeBasicWord(' '),
          makeBasicWord('b'),
          makeBasicWord(' '),
          makeBasicWord('c'),
          makeBasicWord(' '),
          makeBasicWord('d'),
          makeBasicWord(' '),
          makeBasicWord('e'),
        ],
      },
      {
        type: DELETE_WORD,
        payload: {
          startIndex: 2,
          endIndex: 6,
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(wordsWithoutSpaces(output)).toEqual([
      makeBasicWord('a'),
      makeBasicWord('b', true),
      makeBasicWord('c', true),
      makeBasicWord('d'),
      makeBasicWord('e'),
    ]);

    expectAllEvenIndexWordsToBeSpaces(output);
  });

  it('should handle deletions being undone', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord(' '),
          makeBasicWord('b'),
          makeBasicWord(' '),
          makeBasicWord('c', true),
          makeBasicWord(' '),
          makeBasicWord('d', true),
          makeBasicWord(' '),
          makeBasicWord('e', true),
        ],
      },
      {
        type: UNDO_DELETE_WORD,
        payload: {
          startIndex: 4,
          endIndex: 9,
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(wordsWithoutSpaces(output)).toEqual([
      makeBasicWord('a'),
      makeBasicWord('b'),
      makeBasicWord('c'),
      makeBasicWord('d'),
      makeBasicWord('e'),
    ]);

    expectAllEvenIndexWordsToBeSpaces(output);
  });

  it('should handle words being pasted', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord(' '),
          makeBasicWord('b'),
          makeBasicWord(' '),
          makeBasicWord('c', true),
          makeBasicWord(' '),
          makeBasicWord('d', true),
          makeBasicWord(' '),
          makeBasicWord('e', true),
        ],
      },
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 4,
          clipboard: [
            makeBasicWord('f'),
            makeBasicWord(' '),
            makeBasicWord('g'),
            makeBasicWord(' '),
            makeBasicWord('h'),
          ],
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(wordsWithoutSpaces(output)).toEqual([
      makeBasicWord('a'),
      makeBasicWord('b'),
      makeBasicWord('c', true),
      makeBasicWord('f'),
      makeBasicWord('g'),
      makeBasicWord('h'),
      makeBasicWord('d', true),
      makeBasicWord('e', true),
    ]);

    expectAllEvenIndexWordsToBeSpaces(output);
  });

  it('should handle words being pasted even when some of the words on the clipboard were deleted', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord(' '),
          makeBasicWord('b', true),
          makeBasicWord(' '),
          makeBasicWord('c'),
          makeBasicWord(' '),
          makeBasicWord('d'),
          makeBasicWord(' '),
          makeBasicWord('e', true),
        ],
      },
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 4,
          clipboard: [
            makeBasicWord('f'),
            makeBasicWord(' '),
            makeBasicWord('g', true),
            makeBasicWord(' '),
            makeBasicWord('h'),
          ],
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(wordsWithoutSpaces(output)).toEqual([
      makeBasicWord('a'),
      makeBasicWord('b', true),
      makeBasicWord('c'),
      makeBasicWord('f'),
      makeBasicWord('g', true),
      makeBasicWord('h'),
      makeBasicWord('d'),
      makeBasicWord('e', true),
    ]);

    expectAllEvenIndexWordsToBeSpaces(output);
  });

  it('should handle words being pasted just after the start of the transcription', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord(' '),
          makeBasicWord('b'),
          makeBasicWord(' '),
          makeBasicWord('c'),
          makeBasicWord(' '),
          makeBasicWord('d'),
          makeBasicWord(' '),
          makeBasicWord('e'),
        ],
      },
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 0,
          clipboard: [
            makeBasicWord('f'),
            makeBasicWord(' '),
            makeBasicWord('g'),
            makeBasicWord(' '),
            makeBasicWord('h'),
          ],
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(wordsWithoutSpaces(output)).toEqual([
      makeBasicWord('a'),
      makeBasicWord('f'),
      makeBasicWord('g'),
      makeBasicWord('h'),
      makeBasicWord('b'),
      makeBasicWord('c'),
      makeBasicWord('d'),
      makeBasicWord('e'),
    ]);

    expectAllEvenIndexWordsToBeSpaces(output);
  });

  it('should handle words being pasted to the end of the transcription', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord(' '),
          makeBasicWord('b'),
          makeBasicWord(' '),
          makeBasicWord('c'),
          makeBasicWord(' '),
          makeBasicWord('d'),
          makeBasicWord(' '),
          makeBasicWord('e'),
        ],
      },
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 8,
          clipboard: [
            makeBasicWord('f'),
            makeBasicWord(' '),
            makeBasicWord('g'),
            makeBasicWord(' '),
            makeBasicWord('h'),
          ],
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(wordsWithoutSpaces(output)).toEqual([
      makeBasicWord('a'),
      makeBasicWord('b'),
      makeBasicWord('c'),
      makeBasicWord('d'),
      makeBasicWord('e'),
      makeBasicWord('f'),
      makeBasicWord('g'),
      makeBasicWord('h'),
    ]);

    expectAllEvenIndexWordsToBeSpaces(output);
  });

  it('should handle a paste being undone', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a'),
          makeBasicWord(' '),
          makeBasicWord('b'),
          makeBasicWord(' '),
          makeBasicWord('c'),
          makeBasicWord(' '),
          makeBasicWord('d'),
          makeBasicWord(' '),
          makeBasicWord('e'),
        ],
      },
      {
        type: UNDO_PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboardLength: 3,
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(wordsWithoutSpaces(output)).toEqual([
      makeBasicWord('a'),
      makeBasicWord('b'),
      makeBasicWord('e'),
    ]);

    expectAllEvenIndexWordsToBeSpaces(output);
  });

  it('should handle a paste being undone with various words deleted', () => {
    const output = transcriptionReducer(
      {
        confidence: 1,
        duration: 100,
        words: [
          makeBasicWord('a', true),
          makeBasicWord(' '),
          makeBasicWord('b'),
          makeBasicWord(' '),
          makeBasicWord('c', true),
          makeBasicWord(' '),
          makeBasicWord('d', true),
          makeBasicWord(' '),
          makeBasicWord('e'),
        ],
      },
      {
        type: UNDO_PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboardLength: 3,
        },
      }
    );

    // expect confidence and duration to be reflected
    expect(output?.confidence).toBe(1);
    expect(output?.duration).toBe(100);

    expect(wordsWithoutSpaces(output)).toEqual([
      makeBasicWord('a', true),
      makeBasicWord('b'),
      makeBasicWord('e'),
    ]);

    expectAllEvenIndexWordsToBeSpaces(output);
  });
});
