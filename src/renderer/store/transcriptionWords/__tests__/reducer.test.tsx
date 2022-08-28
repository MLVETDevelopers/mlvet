import { Word } from 'sharedTypes';
import {
  DELETE_SELECTION,
  PASTE_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_PASTE_WORD,
} from '../actions';
import transcriptionWordsReducer from '../reducer';

// TODO: refactor this out to use the more generic makeBasicWord util - a lot of grunt work
const makeBasicWordSequential: (
  originalIndex: number,
  text: string,
  isDeleted?: boolean,
  pasteKey?: number
) => Word = (originalIndex, text, isDeleted = false, pasteKey = 0) => ({
  word: text,
  startTime: 0,
  duration: 0,
  bufferDurationBefore: 0,
  bufferDurationAfter: 0,
  outputStartTime: 0,
  deleted: isDeleted,
  originalIndex,
  pasteKey,
  confidence: 1,
});

describe('Transcription words reducer', () => {
  it('should handle words being deleted', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWordSequential(0, 'a'),
        makeBasicWordSequential(1, 'b'),
        makeBasicWordSequential(2, 'c'),
        makeBasicWordSequential(3, 'd'),
        makeBasicWordSequential(4, 'e'),
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
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b', true),
      makeBasicWordSequential(2, 'c', true),
      makeBasicWordSequential(3, 'd'),
      makeBasicWordSequential(4, 'e'),
    ]);
  });

  it('should handle deletions being undone', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWordSequential(0, 'a'),
        makeBasicWordSequential(1, 'b'),
        makeBasicWordSequential(2, 'c', true),
        makeBasicWordSequential(3, 'd', true),
        makeBasicWordSequential(4, 'e', true),
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
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b'),
      makeBasicWordSequential(2, 'c'),
      makeBasicWordSequential(3, 'd'),
      makeBasicWordSequential(4, 'e'),
    ]);
  });

  it('should handle deletions for non-contiguous ranges', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWordSequential(0, 'a'),
        makeBasicWordSequential(1, 'b'),
        makeBasicWordSequential(2, 'c'),
        makeBasicWordSequential(3, 'd'),
        makeBasicWordSequential(4, 'e'),
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
      makeBasicWordSequential(0, 'a', true),
      makeBasicWordSequential(1, 'b', true),
      makeBasicWordSequential(2, 'c'),
      makeBasicWordSequential(3, 'd', true),
      makeBasicWordSequential(4, 'e'),
    ]);
  });

  it('should handle deletions being undone for non-contiguous ranges', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWordSequential(0, 'a', true),
        makeBasicWordSequential(1, 'b', true),
        makeBasicWordSequential(2, 'c'),
        makeBasicWordSequential(3, 'd', true),
        makeBasicWordSequential(4, 'e', true),
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
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b', true),
      makeBasicWordSequential(2, 'c'),
      makeBasicWordSequential(3, 'd'),
      makeBasicWordSequential(4, 'e'),
    ]);
  });

  it('should handle words being pasted', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWordSequential(0, 'a'),
        makeBasicWordSequential(1, 'b'),
        makeBasicWordSequential(2, 'c', true),
        makeBasicWordSequential(3, 'd', true),
        makeBasicWordSequential(4, 'e', true),
        makeBasicWordSequential(5, 'f', true),
        makeBasicWordSequential(6, 'g', true),
        makeBasicWordSequential(7, 'h', true),
      ],
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboard: [
            makeBasicWordSequential(5, 'f'),
            makeBasicWordSequential(6, 'g'),
            makeBasicWordSequential(7, 'h'),
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b'),
      makeBasicWordSequential(2, 'c', true),
      makeBasicWordSequential(5, 'f', false, 1),
      makeBasicWordSequential(6, 'g', false, 2),
      makeBasicWordSequential(7, 'h', false, 3),
      makeBasicWordSequential(3, 'd', true),
      makeBasicWordSequential(4, 'e', true),
      makeBasicWordSequential(5, 'f', true),
      makeBasicWordSequential(6, 'g', true),
      makeBasicWordSequential(7, 'h', true),
    ]);
  });

  it('should handle words that were already pasted, being pasted again', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWordSequential(0, 'a'),
        makeBasicWordSequential(1, 'b'),
        makeBasicWordSequential(2, 'c', true),
        makeBasicWordSequential(3, 'd', true),
        makeBasicWordSequential(4, 'e', true),
        makeBasicWordSequential(5, 'f'),
        makeBasicWordSequential(6, 'g'),
        makeBasicWordSequential(7, 'h'),
        makeBasicWordSequential(5, 'f', false, 1),
        makeBasicWordSequential(6, 'g', false, 2),
        makeBasicWordSequential(7, 'h', false, 3),
      ],
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboard: [
            makeBasicWordSequential(5, 'f'),
            makeBasicWordSequential(6, 'g'),
            makeBasicWordSequential(7, 'h'),
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b'),
      makeBasicWordSequential(2, 'c', true),
      makeBasicWordSequential(5, 'f', false, 4),
      makeBasicWordSequential(6, 'g', false, 5),
      makeBasicWordSequential(7, 'h', false, 6),
      makeBasicWordSequential(3, 'd', true),
      makeBasicWordSequential(4, 'e', true),
      makeBasicWordSequential(5, 'f'),
      makeBasicWordSequential(6, 'g'),
      makeBasicWordSequential(7, 'h'),
      makeBasicWordSequential(5, 'f', false, 1),
      makeBasicWordSequential(6, 'g', false, 2),
      makeBasicWordSequential(7, 'h', false, 3),
    ]);
  });

  it('should handle words being pasted even when some of the words on the clipboard were deleted', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWordSequential(0, 'a'),
        makeBasicWordSequential(1, 'b', true),
        makeBasicWordSequential(2, 'c'),
        makeBasicWordSequential(3, 'd'),
        makeBasicWordSequential(4, 'e', true),
        makeBasicWordSequential(5, 'f', true),
        makeBasicWordSequential(6, 'g', true),
        makeBasicWordSequential(7, 'h', true),
      ],
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboard: [
            makeBasicWordSequential(5, 'f'),
            makeBasicWordSequential(6, 'g', true),
            makeBasicWordSequential(7, 'h'),
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b', true),
      makeBasicWordSequential(2, 'c'),
      makeBasicWordSequential(5, 'f', false, 1),
      makeBasicWordSequential(6, 'g', true, 2),
      makeBasicWordSequential(7, 'h', false, 3),
      makeBasicWordSequential(3, 'd'),
      makeBasicWordSequential(4, 'e', true),
      makeBasicWordSequential(5, 'f', true),
      makeBasicWordSequential(6, 'g', true),
      makeBasicWordSequential(7, 'h', true),
    ]);
  });

  it('should handle words being pasted just after the start of the transcription', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWordSequential(0, 'a'),
        makeBasicWordSequential(1, 'b'),
        makeBasicWordSequential(2, 'c'),
        makeBasicWordSequential(3, 'd'),
        makeBasicWordSequential(4, 'e'),
        makeBasicWordSequential(5, 'f', true),
        makeBasicWordSequential(6, 'g', true),
        makeBasicWordSequential(7, 'h', true),
      ],
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 0,
          clipboard: [
            makeBasicWordSequential(5, 'f'),
            makeBasicWordSequential(6, 'g'),
            makeBasicWordSequential(7, 'h'),
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(5, 'f', false, 1),
      makeBasicWordSequential(6, 'g', false, 2),
      makeBasicWordSequential(7, 'h', false, 3),
      makeBasicWordSequential(1, 'b'),
      makeBasicWordSequential(2, 'c'),
      makeBasicWordSequential(3, 'd'),
      makeBasicWordSequential(4, 'e'),
      makeBasicWordSequential(5, 'f', true),
      makeBasicWordSequential(6, 'g', true),
      makeBasicWordSequential(7, 'h', true),
    ]);
  });

  it('should handle words being pasted to the end of the transcription', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWordSequential(0, 'a'),
        makeBasicWordSequential(1, 'b'),
        makeBasicWordSequential(2, 'c'),
        makeBasicWordSequential(3, 'd', true),
        makeBasicWordSequential(4, 'e', true),
        makeBasicWordSequential(5, 'f', true),
        makeBasicWordSequential(6, 'g'),
        makeBasicWordSequential(7, 'h'),
      ],
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 7,
          clipboard: [
            makeBasicWordSequential(3, 'd'),
            makeBasicWordSequential(4, 'e'),
            makeBasicWordSequential(5, 'f'),
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b'),
      makeBasicWordSequential(2, 'c'),
      makeBasicWordSequential(3, 'd', true),
      makeBasicWordSequential(4, 'e', true),
      makeBasicWordSequential(5, 'f', true),
      makeBasicWordSequential(6, 'g'),
      makeBasicWordSequential(7, 'h'),
      makeBasicWordSequential(3, 'd', false, 1),
      makeBasicWordSequential(4, 'e', false, 2),
      makeBasicWordSequential(5, 'f', false, 3),
    ]);
  });

  it('should handle a paste being undone', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWordSequential(0, 'a'),
        makeBasicWordSequential(1, 'b'),
        makeBasicWordSequential(2, 'c', false, 1),
        makeBasicWordSequential(3, 'd', false, 2),
        makeBasicWordSequential(2, 'c'),
        makeBasicWordSequential(3, 'd'),
        makeBasicWordSequential(4, 'e'),
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
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b'),
      makeBasicWordSequential(2, 'c'),
      makeBasicWordSequential(3, 'd'),
      makeBasicWordSequential(4, 'e'),
    ]);
  });

  it('should handle a paste being undone with various words deleted', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWordSequential(0, 'a', true),
        makeBasicWordSequential(1, 'b'),
        makeBasicWordSequential(2, 'c', true, 1),
        makeBasicWordSequential(3, 'd', false, 2),
        makeBasicWordSequential(2, 'c', true),
        makeBasicWordSequential(3, 'd'),
        makeBasicWordSequential(4, 'e'),
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
      makeBasicWordSequential(0, 'a', true),
      makeBasicWordSequential(1, 'b'),
      makeBasicWordSequential(2, 'c', true),
      makeBasicWordSequential(3, 'd'),
      makeBasicWordSequential(4, 'e'),
    ]);
  });

  it('should handle a paste of multiple words with the same original index', () => {
    const output = transcriptionWordsReducer(
      [
        makeBasicWordSequential(0, 'a'),
        makeBasicWordSequential(0, 'a', false, 1),
        makeBasicWordSequential(1, 'b'),
      ],
      {
        type: PASTE_WORD,
        payload: {
          startIndex: 2,
          clipboard: [
            makeBasicWordSequential(0, 'a'),
            makeBasicWordSequential(0, 'a', false, 1),
          ],
        },
      }
    );

    expect(output).toEqual([
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(0, 'a', false, 1),
      makeBasicWordSequential(1, 'b'),
      makeBasicWordSequential(0, 'a', false, 2),
      makeBasicWordSequential(0, 'a', false, 3),
    ]);
  });
});
