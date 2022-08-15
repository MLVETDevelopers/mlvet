import { Word } from 'sharedTypes';
import { splitWord } from '../splitWord';

const makeBasicWord: (override: Partial<Word>) => Word = (override) => ({
  word: 'test',
  duration: 0,
  startTime: 0,
  outputStartTime: 0,
  bufferDurationBefore: 0,
  bufferDurationAfter: 0,
  originalIndex: 0,
  pasteKey: 0,
  deleted: false,
  fileName: 'sample.mp4',
  ...override,
});

describe('splitWord', () => {
  it('should handle splitting a word into two', () => {
    const firstWord = makeBasicWord({
      originalIndex: 0,
      startTime: 1,
      bufferDurationBefore: 1,
      duration: 1,
      bufferDurationAfter: 1,
    });

    const lastWord = makeBasicWord({
      originalIndex: 2,
      startTime: 9,
      bufferDurationBefore: 1,
      duration: 1,
      bufferDurationAfter: 1,
    });

    const words: Word[] = [
      firstWord,
      makeBasicWord({
        originalIndex: 1,
        startTime: 4,
        bufferDurationBefore: 1,
        duration: 3,
        bufferDurationAfter: 1,
        word: 'first second',
      }),
      lastWord,
    ];

    const index = 1;

    const splitWords = splitWord(words, index);

    expect(splitWords).toEqual([
      firstWord,
      makeBasicWord({
        originalIndex: 1,
        startTime: 4,
        bufferDurationBefore: 1,
        duration: 3,
        bufferDurationAfter: 1,
        word: 'first second',
      }),
      makeBasicWord({
        originalIndex: 1,
        startTime: 4,
        bufferDurationBefore: 1,
        duration: 3,
        bufferDurationAfter: 1,
        word: 'first second',
      }),
      lastWord,
    ]);
  });
});
