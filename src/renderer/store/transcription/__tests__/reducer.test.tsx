import { Word } from 'sharedTypes';
import { TRANSCRIPTION_CREATED } from 'renderer/store/transcription/actions';
import transcriptionReducer from '../reducer';

const makeBasicWord: (
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
  fileName: 'PLACEHOLDER FILENAME',
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
