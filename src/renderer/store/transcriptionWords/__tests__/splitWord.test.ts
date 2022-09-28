import { Word } from 'sharedTypes';
import { makeBasicWord } from 'sharedUtils';
import { splitWord } from '../helpers/splitWordHelper';

describe('splitWord', () => {
  it('should handle splitting a word into two', () => {
    const firstWord = makeBasicWord({
      originalIndex: 0,
      startTime: 1,
      bufferDurationBefore: 1,
      duration: 1,
      bufferDurationAfter: 1,
      pasteKey: 0,
    });

    const lastWord = makeBasicWord({
      originalIndex: 2,
      startTime: 9,
      bufferDurationBefore: 1,
      duration: 1,
      bufferDurationAfter: 1,
      pasteKey: 0,
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
        pasteKey: 0,
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
        duration: 1.5,
        bufferDurationAfter: 0,
        word: 'first',
        pasteKey: 1,
      }),
      makeBasicWord({
        originalIndex: 1,
        startTime: 5.5,
        bufferDurationBefore: 0,
        duration: 1.5,
        bufferDurationAfter: 1,
        word: 'second',
        pasteKey: 2,
      }),
      lastWord,
    ]);
  });
});
