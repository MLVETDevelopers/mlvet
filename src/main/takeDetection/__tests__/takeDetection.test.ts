import { AssertionError } from 'assert';
import { Word } from '../../../sharedTypes';
import { makeBasicWord } from '../../../sharedUtils';
import { InjectableTakeGroup } from '../../editDelete/injectTakeInfo';
import { findSentences, Sentence, findTakes } from '../takeDetection';
import { getSimilarityScore } from '../sentenceSimilarity';

function mockGetSentenceSimilarity(
  sentenceOne: string,
  sentenceTwo: string
): number {
  if (sentenceOne === 'Hello world!' && sentenceTwo === 'Hi there.') {
    return 0.8;
  }
  if (sentenceOne === 'Hello world!' && sentenceTwo === 'All ok?') {
    return 0.2;
  }
  if (sentenceOne === 'All ok?' && sentenceTwo === 'test.') {
    return 0.4;
  }
  if (sentenceOne === 'test.' && sentenceTwo === 'assessment.') {
    return 0.8;
  }
  if (sentenceOne === 'test.' && sentenceTwo === 'exam') {
    return 0.8;
  }
  throw new AssertionError();
}

jest.mock('../sentenceSimilarity');
const mockedSentenceSim = getSimilarityScore as jest.Mocked<
  typeof getSimilarityScore
>;

const makeWords = (words: string[]): Word[] => {
  return words.map((word) => {
    return makeBasicWord({ word });
  });
};

describe('findSentences should return a list of Sentence objects based on punctuation and findTakes should correctly identify different takes', () => {
  it('should produce expected sentences when given a list of words', () => {
    const wordList = makeWords([
      'Hello',
      'world!',
      'Hi',
      'there.',
      'All',
      'ok?',
      'test.',
      'assessment.',
      'exam',
    ]);
    const sentences: Sentence[] = findSentences(wordList);

    expect(sentences).toEqual([
      {
        startIndex: 0,
        endIndex: 2,
        sentenceString: 'Hello world!',
      },
      {
        startIndex: 2,
        endIndex: 4,
        sentenceString: 'Hi there.',
      },
      {
        startIndex: 4,
        endIndex: 6,
        sentenceString: 'All ok?',
      },
      {
        startIndex: 6,
        endIndex: 7,
        sentenceString: 'test.',
      },
      {
        startIndex: 7,
        endIndex: 8,
        sentenceString: 'assessment.',
      },
      {
        startIndex: 8,
        endIndex: 9,
        sentenceString: 'exam',
      },
    ]);
  });
  it('should correctly identify takes based on similarity threshold and consecutiveness and produce expected outupts', () => {
    const wordList = makeWords([
      'Hello',
      'world!',
      'Hi',
      'there.',
      'All',
      'ok?',
      'test.',
      'assessment.',
      'exam',
    ]);

    (mockedSentenceSim as jest.Mock).mockImplementation(
      mockGetSentenceSimilarity
    );
    const takes: InjectableTakeGroup[] = findTakes(wordList, 0.7);
    expect(takes).toEqual([
      {
        takes: [
          { wordRange: { startIndex: 0, endIndex: 2 } },
          { wordRange: { startIndex: 2, endIndex: 4 } },
        ],
      },
      {
        takes: [
          { wordRange: { startIndex: 6, endIndex: 7 } },
          { wordRange: { startIndex: 7, endIndex: 8 } },
          { wordRange: { startIndex: 8, endIndex: 9 } },
        ],
      },
    ]);
  });
});
