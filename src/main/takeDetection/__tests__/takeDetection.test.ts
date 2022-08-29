import { AssertionError } from 'assert';
import { Word } from 'sharedTypes';
import { InjectableTakeGroup } from 'main/editDelete/injectTakeInfo';
import { findSentences, Sentence, findTakes } from '../takeDetection';
import getSimilarityScore from '../sentenceSimilarity';

function mockGetSentenceSimilarity(
  sentenceOne: string,
  sentenceTwo: string
): number {
  if (sentenceOne === 'Hello world!' && sentenceTwo === 'Hi there.') {
    return 0.8;
  }
  if (sentenceOne === 'Hi there.' && sentenceTwo === 'All ok?') {
    return 0.2;
  }
  if (sentenceOne === 'All ok?' && sentenceTwo === 'test.') {
    return 0.4;
  }
  if (sentenceOne === 'test.' && sentenceTwo === 'assessment.') {
    return 0.8;
  }
  if (sentenceOne === 'assessment.' && sentenceTwo === 'exam') {
    return 0.8;
  }
  throw new AssertionError();
}

jest.mock('../sentenceSimilarity');
const mockedSentenceSim = getSimilarityScore as jest.Mocked<
  typeof getSimilarityScore
>;

describe('findSentences should return a list of Sentence objects based on punctuation and findTakes should correctly identify different takes', () => {
  it('should produce expected sentences when given a list of words', () => {
    const wordList: Word[] = [
      {
        word: 'Hello',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'world!',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'Hi',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'there.',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'All',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'ok?',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'test.',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'assessment.',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'exam',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
    ];
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
    const wordList: Word[] = [
      {
        word: 'Hello',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'world!',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'Hi',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'there.',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'All',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'ok?',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'test.',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'assessment.',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
      {
        word: 'exam',
        duration: 1,
        startTime: 0,
        outputStartTime: 0,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        deleted: false,
        confidence: 1,
        takeInfo: null,
      },
    ];

    (mockedSentenceSim as jest.Mock).mockImplementation(
      mockGetSentenceSimilarity
    );
    const takes: InjectableTakeGroup[] = findTakes(wordList);
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