import {
  DELETE_WORD,
  PASTE_WORD,
  UNDO_DELETE_WORD,
  UNDO_PASTE_WORD,
} from 'renderer/store/undoStack/ops';
import { Word } from 'sharedTypes';
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
    expect(
      transcriptionReducer(
        {
          confidence: 1,
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
      )
    ).toEqual({
      confidence: 1,
      words: [
        makeBasicWord('a'),
        makeBasicWord('b', true),
        makeBasicWord('c', true),
        makeBasicWord('d'),
        makeBasicWord('e'),
      ],
    });
  });

  it('should handle deletions being undone', () => {
    expect(
      transcriptionReducer(
        {
          confidence: 1,
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
      )
    ).toEqual({
      confidence: 1,
      words: [
        makeBasicWord('a'),
        makeBasicWord('b'),
        makeBasicWord('c'),
        makeBasicWord('d'),
        makeBasicWord('e'),
      ],
    });
  });

  it('should handle words being pasted', () => {
    expect(
      transcriptionReducer(
        {
          confidence: 1,
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
            startIndex: 2,
            clipboard: [
              makeBasicWord('f'),
              makeBasicWord('g'),
              makeBasicWord('h'),
            ],
          },
        }
      )
    ).toEqual({
      confidence: 1,
      words: [
        makeBasicWord('a'),
        makeBasicWord('b'),
        makeBasicWord('c'),
        makeBasicWord('f'),
        makeBasicWord('g'),
        makeBasicWord('h'),
        makeBasicWord('d'),
        makeBasicWord('e'),
      ],
    });
  });

  it('should handle words being pasted even when some of the words on the clipboard were deleted', () => {
    expect(
      transcriptionReducer(
        {
          confidence: 1,
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
      )
    ).toEqual({
      confidence: 1,
      words: [
        makeBasicWord('a'),
        makeBasicWord('b', true),
        makeBasicWord('c'),
        makeBasicWord('f'),
        makeBasicWord('g', true),
        makeBasicWord('h'),
        makeBasicWord('d'),
        makeBasicWord('e', true),
      ],
    });
  });

  it('should handle words being pasted just after the start of the transcription', () => {
    expect(
      transcriptionReducer(
        {
          confidence: 1,
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
      )
    ).toEqual({
      confidence: 1,
      words: [
        makeBasicWord('a'),
        makeBasicWord('f'),
        makeBasicWord('g'),
        makeBasicWord('h'),
        makeBasicWord('b'),
        makeBasicWord('c'),
        makeBasicWord('d'),
        makeBasicWord('e'),
      ],
    });
  });

  it('should handle words being pasted to the end of the transcription', () => {
    expect(
      transcriptionReducer(
        {
          confidence: 1,
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
      )
    ).toEqual({
      confidence: 1,
      words: [
        makeBasicWord('a'),
        makeBasicWord('b'),
        makeBasicWord('c'),
        makeBasicWord('d'),
        makeBasicWord('e'),
        makeBasicWord('f'),
        makeBasicWord('g'),
        makeBasicWord('h'),
      ],
    });
  });

  it('should handle a paste being undone', () => {
    expect(
      transcriptionReducer(
        {
          confidence: 1,
          words: [
            makeBasicWord('a'),
            makeBasicWord('b'),
            makeBasicWord('c'),
            makeBasicWord('d'),
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
      )
    ).toEqual({
      confidence: 1,
      words: [makeBasicWord('a'), makeBasicWord('b'), makeBasicWord('e')],
    });
  });

  it('should handle a paste being undone with various words deleted', () => {
    expect(
      transcriptionReducer(
        {
          confidence: 1,
          words: [
            makeBasicWord('a', true),
            makeBasicWord('b'),
            makeBasicWord('c', true),
            makeBasicWord('d', true),
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
      )
    ).toEqual({
      confidence: 1,
      words: [makeBasicWord('a', true), makeBasicWord('b'), makeBasicWord('e')],
    });
  });
});
