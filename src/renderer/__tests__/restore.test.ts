import {
  getOriginalWords,
  getRestoreIndexRange,
} from 'renderer/editor/restore';
import { Word } from 'sharedTypes';

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
  takeInfo: null,
});

describe('getRestoreIndexRange', () => {
  it('should return original text index range', () => {
    const words = [
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b', true),
      makeBasicWordSequential(2, 'c', true),
      makeBasicWordSequential(3, 'd', true),
      makeBasicWordSequential(4, 'e'),
    ];

    const indexRange = getRestoreIndexRange(1, words);

    expect(indexRange).toEqual({ startIndex: 1, endIndex: 4 });
  });

  it('should work with only the first word in the sequence', () => {
    const words = [
      makeBasicWordSequential(0, 'a', true),
      makeBasicWordSequential(1, 'b'),
      makeBasicWordSequential(2, 'c'),
      makeBasicWordSequential(3, 'd'),
      makeBasicWordSequential(4, 'e'),
    ];

    const indexRange = getRestoreIndexRange(1, words);

    expect(indexRange).toEqual({ startIndex: 1, endIndex: 2 });
  });

  it('should work with only the last word in the sequence', () => {
    const words = [
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b'),
      makeBasicWordSequential(2, 'c'),
      makeBasicWordSequential(3, 'd'),
      makeBasicWordSequential(4, 'e', true),
    ];

    const indexRange = getRestoreIndexRange(4, words);

    expect(indexRange).toEqual({ startIndex: 4, endIndex: 5 });
  });

  it('should handle a broken sequence', () => {
    const words = [
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b', true),
      makeBasicWordSequential(2, 'c', true),
      makeBasicWordSequential(3, 'd'),
      makeBasicWordSequential(4, 'e', true),
    ];

    const indexRange = getRestoreIndexRange(1, words);

    expect(indexRange).toEqual({ startIndex: 1, endIndex: 3 });
  });

  it('should be able to handle the entire transcript', () => {
    const words = [
      makeBasicWordSequential(0, 'a', true),
      makeBasicWordSequential(1, 'b', true),
      makeBasicWordSequential(2, 'c', true),
      makeBasicWordSequential(3, 'd', true),
      makeBasicWordSequential(4, 'e', true),
    ];

    const indexRange = getRestoreIndexRange(0, words);

    expect(indexRange).toEqual({ startIndex: 0, endIndex: 5 });
  });

  it('should not include copied words', () => {
    const words = [
      makeBasicWordSequential(0, 'a', true),
      makeBasicWordSequential(1, 'b', true),
      makeBasicWordSequential(3, 'd', true, 1),
      makeBasicWordSequential(4, 'e', false, 2),
      makeBasicWordSequential(2, 'c', true),
      makeBasicWordSequential(3, 'd', true),
      makeBasicWordSequential(4, 'e'),
    ];

    const indexRangeBeforeCopy = getRestoreIndexRange(0, words);
    expect(indexRangeBeforeCopy).toEqual({ startIndex: 0, endIndex: 2 });

    const indexRangeAfterCopy = getRestoreIndexRange(4, words);
    expect(indexRangeAfterCopy).toEqual({ startIndex: 4, endIndex: 6 });
  });
});

describe('getOriginalWords', () => {
  it('should return original words', () => {
    const words = [
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b', true),
      makeBasicWordSequential(2, 'c', true),
      makeBasicWordSequential(3, 'd', true),
      makeBasicWordSequential(4, 'e'),
    ];

    const originalWords = getOriginalWords(1, words);

    expect(originalWords).toEqual([
      makeBasicWordSequential(1, 'b', true),
      makeBasicWordSequential(2, 'c', true),
      makeBasicWordSequential(3, 'd', true),
    ]);
  });

  it('should handle single word', () => {
    const words = [
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b', true),
      makeBasicWordSequential(2, 'c'),
      makeBasicWordSequential(3, 'd'),
      makeBasicWordSequential(4, 'e'),
    ];

    const originalWords = getOriginalWords(1, words);

    expect(originalWords).toEqual([makeBasicWordSequential(1, 'b', true)]);
  });

  it('should handle last word', () => {
    const words = [
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b'),
      makeBasicWordSequential(2, 'c'),
      makeBasicWordSequential(3, 'd'),
      makeBasicWordSequential(4, 'e', true),
    ];

    const originalWords = getOriginalWords(4, words);

    expect(originalWords).toEqual([makeBasicWordSequential(4, 'e', true)]);
  });

  it('should handle first word', () => {
    const words = [
      makeBasicWordSequential(0, 'a'),
      makeBasicWordSequential(1, 'b'),
      makeBasicWordSequential(2, 'c'),
      makeBasicWordSequential(3, 'd'),
      makeBasicWordSequential(4, 'e', true),
    ];

    const originalWords = getOriginalWords(4, words);

    expect(originalWords).toEqual([makeBasicWordSequential(4, 'e', true)]);
  });
});
