import { Word } from '../../../sharedTypes';
import { makeBasicWord } from '../../../sharedUtils';
import { InjectableTakeGroup } from '../../editDelete/injectTakeInfo';
import { findTakes } from '../takeDetection';

const makeWords = (words: string[]): Word[] => {
  return words.map((word) => {
    return makeBasicWord({ word });
  });
};

describe('findTakes should correctly identify different take groups', () => {
  it('should return an empty takeGroups', () => {
    const wordList = makeWords(
      'should. return. an. empty. takeGroups.'.split(' ')
    );
    const takes: InjectableTakeGroup[] = findTakes(wordList, 0.7);
    expect(takes).toEqual([]);
  });

  it('shoould correctly identify the first three sentences and the second three sentences as one takeGroup', () => {
    const wordList = makeWords(
      'Test. Take. Group. Test. Take. Group.'.split(' ')
    );
    const takes: InjectableTakeGroup[] = findTakes(wordList, 0.7);
    expect(takes).toEqual([
      {
        takes: [
          { wordRange: { startIndex: 0, endIndex: 3 } },
          { wordRange: { startIndex: 3, endIndex: 6 } },
        ],
      },
    ]);
  });

  it('should correctly identify take group in between other sentences', () => {
    const wordList = makeWords(
      'random. sentence. Test. Take. Group. Test. Take. Group. other. random sentence.'.split(
        ' '
      )
    );
    const takes: InjectableTakeGroup[] = findTakes(wordList, 0.7);
    expect(takes).toEqual([
      {
        takes: [
          { wordRange: { startIndex: 2, endIndex: 5 } },
          { wordRange: { startIndex: 5, endIndex: 8 } },
        ],
      },
    ]);
  });

  it('should correctly identify multiple take groups', () => {
    const wordList = makeWords(
      'Test. Take. Group. Test. Take. Group. Test. Take. Group2. Test. Take. Group2.'.split(
        ' '
      )
    );
    const takes: InjectableTakeGroup[] = findTakes(wordList, 0.9);
    expect(takes).toEqual([
      {
        takes: [
          { wordRange: { startIndex: 0, endIndex: 3 } },
          { wordRange: { startIndex: 3, endIndex: 6 } },
        ],
      },
      {
        takes: [
          { wordRange: { startIndex: 6, endIndex: 9 } },
          { wordRange: { startIndex: 9, endIndex: 12 } },
        ],
      },
    ]);
  });

  it('should correctly identify multiple take groups with other sentences', () => {
    const wordList = makeWords(
      'random. sentence. Test. Take. Group. Test. Take. Group. other. random sentence. Test. Take. Group2. Test. Take. Group2. random sentence.'.split(
        ' '
      )
    );
    const takes: InjectableTakeGroup[] = findTakes(wordList, 0.9);
    expect(takes).toEqual([
      {
        takes: [
          { wordRange: { startIndex: 2, endIndex: 5 } },
          { wordRange: { startIndex: 5, endIndex: 8 } },
        ],
      },
      {
        takes: [
          { wordRange: { startIndex: 11, endIndex: 14 } },
          { wordRange: { startIndex: 14, endIndex: 17 } },
        ],
      },
    ]);
  });

  it('should return an empty take group because the there is a extra sententence in between', () => {
    const wordList = makeWords(
      'Test. Take. Group. extra. Test. Take. Group.'.split(' ')
    );
    const takes: InjectableTakeGroup[] = findTakes(wordList, 0.9);
    expect(takes).toEqual([]);
  });

  it('should return the second group because the first one is invalid', () => {
    const wordList = makeWords(
      'random. sentence. Test. Take. Group. extra. Test. Take. Group. other. random. sentence. Test. Take. Group2. Test. Take. Group2. random sentence.'.split(
        ' '
      )
    );
    const takes: InjectableTakeGroup[] = findTakes(wordList, 0.9);
    expect(takes).toEqual([
      {
        takes: [
          { wordRange: { startIndex: 12, endIndex: 15 } },
          { wordRange: { startIndex: 15, endIndex: 18 } },
        ],
      },
    ]);
  });
});
