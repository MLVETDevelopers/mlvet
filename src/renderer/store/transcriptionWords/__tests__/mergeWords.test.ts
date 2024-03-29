import { IndexRange, Word } from 'sharedTypes';
import { makeBasicWord } from 'sharedUtils';
import { mergeWords } from '../helpers/mergeWordsHelper';

describe('mergeWords', () => {
  it('should handle merging two words into one', () => {
    const firstWord = makeBasicWord({
      originalIndex: 0,
      startTime: 1,
      bufferDurationBefore: 1,
      duration: 1,
      bufferDurationAfter: 1,
      pasteKey: 0,
    });

    const lastWord = makeBasicWord({
      originalIndex: 3,
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
        duration: 1.5,
        bufferDurationAfter: 0,
        word: 'first',
        pasteKey: 0,
      }),
      makeBasicWord({
        originalIndex: 2,
        startTime: 5.5,
        bufferDurationBefore: 0,
        duration: 1.5,
        bufferDurationAfter: 1,
        word: 'second',
        pasteKey: 0,
      }),
      lastWord,
    ];

    const range: IndexRange = {
      startIndex: 1,
      endIndex: 3,
    };

    const mergedWords = mergeWords(words, range);

    expect(mergedWords).toEqual([
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
    ]);
  });
});
