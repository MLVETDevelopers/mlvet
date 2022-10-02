import { IndexRange, Word } from 'sharedTypes';
import { makeBasicWord } from 'sharedUtils';
import { isMergeSplitAllowed } from '../helpers';

describe('isMergeSplitAllowed', () => {
  test('should allow merge if at least two words with no deletions between', () => {
    const words: Word[] = [
      makeBasicWord({ originalIndex: 0 }),
      makeBasicWord({ originalIndex: 1 }),
    ];
    const selection: IndexRange = { startIndex: 0, endIndex: 2 };

    const { merge } = isMergeSplitAllowed(words, selection);

    expect(merge).toBe(true);
  });

  test('should allow merge with many words if conditions met', () => {
    const words: Word[] = [
      makeBasicWord({ originalIndex: 0 }),
      makeBasicWord({ originalIndex: 1 }),
      makeBasicWord({ originalIndex: 2 }),
      makeBasicWord({ originalIndex: 3 }),
      makeBasicWord({ originalIndex: 4 }),
      makeBasicWord({ originalIndex: 5 }),
    ];
    const selection: IndexRange = { startIndex: 1, endIndex: 5 };

    const { merge } = isMergeSplitAllowed(words, selection);

    expect(merge).toBe(true);
  });

  test('should disallow merge if only one word', () => {
    const words: Word[] = [makeBasicWord({ originalIndex: 0 })];
    const selection: IndexRange = { startIndex: 0, endIndex: 1 };

    const { merge } = isMergeSplitAllowed(words, selection);

    expect(merge).toBe(false);
  });

  test('should allow merge even if words not in original order', () => {
    const words: Word[] = [
      makeBasicWord({ originalIndex: 1 }),
      makeBasicWord({ originalIndex: 0 }),
    ];
    const selection: IndexRange = { startIndex: 0, endIndex: 2 };

    const { merge } = isMergeSplitAllowed(words, selection);

    expect(merge).toBe(true);
  });

  test('should disallow merge if there is a deleted word between the selected words', () => {
    const words: Word[] = [
      makeBasicWord({ originalIndex: 0 }),
      makeBasicWord({ originalIndex: 1, deleted: true }),
      makeBasicWord({ originalIndex: 2 }),
    ];
    const selection: IndexRange = { startIndex: 0, endIndex: 3 };

    const { merge } = isMergeSplitAllowed(words, selection);

    expect(merge).toBe(false);
  });

  test('should allow split if word is splittable and not deleted', () => {
    const words: Word[] = [makeBasicWord({ word: 'two words' })];

    const selection: IndexRange = { startIndex: 0, endIndex: 1 };

    const { split } = isMergeSplitAllowed(words, selection);

    expect(split).toBe(true);
  });

  test('should allow split into many words if conditions met', () => {
    const words: Word[] = [makeBasicWord({ word: 'lots and lots of words' })];

    const selection: IndexRange = { startIndex: 0, endIndex: 1 };

    const { split } = isMergeSplitAllowed(words, selection);

    expect(split).toBe(true);
  });

  test('should disallow split if multiple words selected', () => {
    const words: Word[] = [
      makeBasicWord({ word: 'lots and lots of words' }),
      makeBasicWord({}),
    ];

    const selection: IndexRange = { startIndex: 0, endIndex: 2 };

    const { split } = isMergeSplitAllowed(words, selection);

    expect(split).toBe(false);
  });

  test('should disallow split if word is not splittable', () => {
    const words: Word[] = [makeBasicWord({ word: 'notsplittable' })];

    const selection: IndexRange = { startIndex: 0, endIndex: 1 };

    const { split } = isMergeSplitAllowed(words, selection);

    expect(split).toBe(false);
  });

  test('should disallow split if word is deleted', () => {
    const words: Word[] = [makeBasicWord({ word: 'two words', deleted: true })];

    const selection: IndexRange = { startIndex: 0, endIndex: 1 };

    const { split } = isMergeSplitAllowed(words, selection);

    expect(split).toBe(false);
  });

  test('should not crash if selection is outside word list length', () => {
    const words: Word[] = [makeBasicWord({})];

    const selection: IndexRange = { startIndex: 5, endIndex: 7 };

    const { merge, split } = isMergeSplitAllowed(words, selection);

    expect(merge).toBe(false);
    expect(split).toBe(false);
  });
});
