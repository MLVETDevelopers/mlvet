import { Word } from 'sharedTypes';
import { TRANSCRIPTION_CREATED } from 'renderer/store/transcription/actions';
import {
  DELETE_SELECTION,
  PASTE_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_PASTE_WORD,
} from 'renderer/store/transcriptionWords/actions';
import transcriptionReducer from '../reducer';

const makeBasicWord: (
  originalIndex: number,
  text: string,
  isDeleted?: boolean,
  pasteKey?: number,
  startTime?: number,
  outputStartTime?: number,
  outputDuration?: number,
  bufferDurationBefore?: number,
  bufferDurationAfter?: number
) => Word = (
  originalIndex,
  text,
  isDeleted = false,
  pasteKey = 0,
  startTime = 0,
  outputStartTime = 0,
  duration = 0,
  bufferDurationBefore = 0,
  bufferDurationAfter = 0
) => ({
  word: text,
  startTime,
  duration,
  bufferDurationBefore,
  bufferDurationAfter,
  outputStartTime,
  deleted: isDeleted,
  originalIndex,
  pasteKey,
  fileName: 'PLACEHOLDER FILENAME',
  takeInfo: null,
});

describe('Transcription reducer', () => {
  it('should handle transcription created', () => {
    expect(
      transcriptionReducer(null, {
        type: TRANSCRIPTION_CREATED,
        payload: {
          confidence: 1,
          duration: 100,
          words: [makeBasicWord(0, 'a')],
        },
      })
    ).toEqual({
      confidence: 1,
      duration: 100,
      words: [makeBasicWord(0, 'a')],
    });
  });
});

it('output duration should be updated after deleting words', () => {
  const transcript = {
    confidence: 1,
    duration: 9.04,
    outputDuration: 9.04,
    words: [
      makeBasicWord(0, 'a', false, undefined, 0, 0, 1, 0, 0.5),
      makeBasicWord(1, 'a', false, undefined, 1.5, 1.5, 0.7, 0.5, 0.2),
      makeBasicWord(2, 'a', false, undefined, 2.9, 2.9, 1.3, 0.5, 0.9),
      makeBasicWord(3, 'a', false, undefined, 5.6, 5.6, 0.24, 0.2, 3),
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
  expect(deleteOutput?.duration).toEqual(9.04);
  expect(deleteOutput?.outputDuration).toEqual(4.94);

  expect(deleteOutput?.words).toEqual([
    makeBasicWord(0, 'a', false, undefined, 0, 0, 1, 0, 0.5),
    makeBasicWord(1, 'a', true, undefined, 1.5, 0, 0.7, 0.5, 0.2),
    makeBasicWord(2, 'a', true, undefined, 2.9, 0, 1.3, 0.5, 0.9),
    makeBasicWord(3, 'a', false, undefined, 5.6, 1.5, 0.24, 0.2, 3),
  ]);
});

it('output duration should be the same as original when deleting and straight after undoing delete', () => {
  const transcript = {
    confidence: 1,
    duration: 9.04,
    outputDuration: 9.04,
    words: [
      makeBasicWord(0, 'a', false, undefined, 0, 0, 1, 0, 0.5),
      makeBasicWord(1, 'a', false, undefined, 1.5, 1.5, 0.7, 0.5, 0.2),
      makeBasicWord(2, 'a', false, undefined, 2.9, 2.9, 1.3, 0.5, 0.9),
      makeBasicWord(3, 'a', false, undefined, 5.6, 5.6, 0.24, 0.2, 3),
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

it('output duration should be 0 after deleting all words', () => {
  const transcript = {
    confidence: 1,
    duration: 9.04,
    outputDuration: 9.04,
    words: [
      makeBasicWord(0, 'a', false, undefined, 0, 0, 1, 0, 0.5),
      makeBasicWord(1, 'a', false, undefined, 1.5, 1.5, 0.7, 0.5, 0.2),
      makeBasicWord(2, 'a', false, undefined, 2.9, 2.9, 1.3, 0.5, 0.9),
      makeBasicWord(3, 'a', false, undefined, 5.6, 5.6, 0.24, 0.2, 3),
    ],
  };

  const deleteOutput = transcriptionReducer(transcript, {
    type: DELETE_SELECTION,
    payload: {
      ranges: [
        {
          startIndex: 0,
          endIndex: 4,
        },
      ],
    },
  });

  expect(deleteOutput?.duration).toEqual(9.04);
  expect(deleteOutput?.outputDuration).toEqual(0);

  expect(deleteOutput?.words).toEqual([
    makeBasicWord(0, 'a', true, undefined, 0, 0, 1, 0, 0.5),
    makeBasicWord(1, 'a', true, undefined, 1.5, 0, 0.7, 0.5, 0.2),
    makeBasicWord(2, 'a', true, undefined, 2.9, 0, 1.3, 0.5, 0.9),
    makeBasicWord(3, 'a', true, undefined, 5.6, 0, 0.24, 0.2, 3),
  ]);
});

it('output duration should calculated from last non deleted word (not always last word)', () => {
  const transcript = {
    confidence: 1,
    duration: 9.04,
    outputDuration: 9.04,
    words: [
      makeBasicWord(0, 'a', false, undefined, 0, 0, 1, 0, 0.5),
      makeBasicWord(1, 'a', false, undefined, 1.5, 1.5, 0.7, 0.5, 0.2),
      makeBasicWord(2, 'a', false, undefined, 2.9, 2.9, 1.3, 0.5, 0.9),
      makeBasicWord(3, 'a', false, undefined, 5.6, 5.6, 0.24, 0.2, 3),
    ],
  };

  const deleteOutput = transcriptionReducer(transcript, {
    type: DELETE_SELECTION,
    payload: {
      ranges: [
        {
          startIndex: 2,
          endIndex: 4,
        },
      ],
    },
  });

  expect(deleteOutput?.duration).toEqual(9.04);
  expect(deleteOutput?.outputDuration).toEqual(2.9);

  expect(deleteOutput?.words).toEqual([
    makeBasicWord(0, 'a', false, undefined, 0, 0, 1, 0, 0.5),
    makeBasicWord(1, 'a', false, undefined, 1.5, 1.5, 0.7, 0.5, 0.2),
    makeBasicWord(2, 'a', true, undefined, 2.9, 0, 1.3, 0.5, 0.9),
    makeBasicWord(3, 'a', true, undefined, 5.6, 0, 0.24, 0.2, 3),
  ]);
});

it('output duration should updated after copying and pasting new text', () => {
  const transcript = {
    confidence: 1,
    duration: 9.04,
    outputDuration: 9.04,
    words: [
      makeBasicWord(0, 'a', false, undefined, 0, 0, 1, 0, 0.5),
      makeBasicWord(1, 'a', false, undefined, 1.5, 1.5, 0.7, 0.5, 0.2),
      makeBasicWord(2, 'a', false, undefined, 2.9, 2.9, 1.3, 0.5, 0.9),
      makeBasicWord(3, 'a', false, undefined, 5.6, 5.6, 0.24, 0.2, 3),
    ],
  };

  const output = transcriptionReducer(transcript, {
    type: PASTE_WORD,
    payload: {
      startIndex: 3,
      clipboard: [
        makeBasicWord(0, 'a', false, undefined, 0, 0, 1, 0, 0.5),
        makeBasicWord(1, 'a', false, undefined, 1.5, 1.5, 0.7, 0.5, 0.2),
      ],
    },
  });

  expect(output?.duration).toEqual(9.04);
  expect(output?.outputDuration).toEqual(11.94);

  expect(output?.words).toEqual([
    makeBasicWord(0, 'a', false, undefined, 0, 0, 1, 0, 0.5),
    makeBasicWord(1, 'a', false, undefined, 1.5, 1.5, 0.7, 0.5, 0.2),
    makeBasicWord(2, 'a', false, undefined, 2.9, 2.9, 1.3, 0.5, 0.9),
    makeBasicWord(3, 'a', false, undefined, 5.6, 5.6, 0.24, 0.2, 3),
    makeBasicWord(0, 'a', false, 1, 0, 9.04, 1, 0, 0.5),
    makeBasicWord(1, 'a', false, 2, 1.5, 10.54, 0.7, 0.5, 0.2),
  ]);
});

it('output duration should stay the same after copying and straight away undoing', () => {
  const transcript = {
    confidence: 1,
    duration: 9.04,
    outputDuration: 9.04,
    words: [
      makeBasicWord(0, 'a', false, undefined, 0, 0, 1, 0, 0.5),
      makeBasicWord(1, 'a', false, undefined, 1.5, 1.5, 0.7, 0.5, 0.2),
      makeBasicWord(2, 'a', false, undefined, 2.9, 2.9, 1.3, 0.5, 0.9),
      makeBasicWord(3, 'a', false, undefined, 5.6, 5.6, 0.24, 0.2, 3),
    ],
  };

  transcriptionReducer(transcript, {
    type: PASTE_WORD,
    payload: {
      startIndex: 3,
      clipboard: [
        makeBasicWord(0, 'a', false, undefined, 0, 0, 1, 0, 0.5),
        makeBasicWord(1, 'a', false, undefined, 1.5, 1.5, 0.7, 0.5, 0.2),
      ],
    },
  });

  const output = transcriptionReducer(transcript, {
    type: UNDO_PASTE_WORD,
    payload: {
      startIndex: 3,
      clipboardLength: 2,
    },
  });

  expect(output?.outputDuration).toEqual(transcript.duration);

  expect(output?.words).toEqual([
    makeBasicWord(0, 'a', false, undefined, 0, 0, 1, 0, 0.5),
    makeBasicWord(1, 'a', false, undefined, 1.5, 1.5, 0.7, 0.5, 0.2),
    makeBasicWord(2, 'a', false, undefined, 2.9, 2.9, 1.3, 0.5, 0.9),
    makeBasicWord(3, 'a', false, undefined, 5.6, 5.6, 0.24, 0.2, 3),
  ]);
});
