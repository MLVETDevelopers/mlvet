import { DELETE_WORD } from 'renderer/store/undoStack/ops';
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

  it('should handle words deleted', () => {
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
});
