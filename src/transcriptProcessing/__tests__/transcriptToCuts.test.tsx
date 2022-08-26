import '@testing-library/jest-dom';
import { Word } from '../../sharedTypes';
import convertTranscriptToCuts from '../transcriptToCuts';

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
  takeInfo: null,
  ...override,
});

describe('transcript To Cuts', () => {
  it('Should produce a single cut from an unedited transcript', async () => {
    const cuts = convertTranscriptToCuts({
      confidence: 0,
      duration: 6,
      outputDuration: 6,
      words: [
        makeBasicWord({
          originalIndex: 0,
          word: 'Heat',
          startTime: 0.5,
          duration: 1,
          bufferDurationBefore: 0.5,
          bufferDurationAfter: 0.5,
        }),
        makeBasicWord({
          originalIndex: 1,
          word: 'from',
          startTime: 2.5,
          duration: 1,
          bufferDurationBefore: 0.5,
          bufferDurationAfter: 0.5,
        }),
        makeBasicWord({
          originalIndex: 2,
          word: 'fire',
          startTime: 4.5,
          duration: 1,
          bufferDurationBefore: 0.5,
          bufferDurationAfter: 0.5,
        }),
      ],
    });

    const expectedCuts = [
      {
        startTime: 0,
        duration: 6,
        outputStartTime: 0,
        index: 0,
      },
    ];

    expect(cuts).toEqual(expectedCuts);
  });

  it('Should produce two cuts when a word in the middle is deleted', async () => {
    const cuts = convertTranscriptToCuts({
      confidence: 0,
      duration: 6,
      outputDuration: 6,
      words: [
        makeBasicWord({
          originalIndex: 0,
          word: 'Heat',
          startTime: 0.5,
          duration: 1,
          bufferDurationBefore: 0.5,
          bufferDurationAfter: 0.5,
        }),
        makeBasicWord({
          originalIndex: 2,
          word: 'fire',
          startTime: 4.5,
          duration: 1,
          bufferDurationBefore: 0.5,
          bufferDurationAfter: 0.5,
        }),
      ],
    });

    const expectedCuts = [
      {
        startTime: 0,
        duration: 2,
        outputStartTime: 0,
        index: 0,
      },
      {
        startTime: 4,
        duration: 2,
        outputStartTime: 2,
        index: 1,
      },
    ];

    expect(cuts).toEqual(expectedCuts);
  });

  it('Should handle first word of transcript moved to middle', async () => {
    const cuts = convertTranscriptToCuts({
      confidence: 0,
      duration: 6,
      outputDuration: 6,
      words: [
        makeBasicWord({
          originalIndex: 1,
          word: 'from',
          startTime: 2.5,
          duration: 1,
          bufferDurationBefore: 0.5,
          bufferDurationAfter: 0.5,
        }),
        makeBasicWord({
          originalIndex: 0,
          word: 'Heat',
          startTime: 0.5,
          duration: 1,
          bufferDurationBefore: 0.5,
          bufferDurationAfter: 0.5,
        }),
        makeBasicWord({
          originalIndex: 2,
          word: 'fire',
          startTime: 4.5,
          duration: 1,
          bufferDurationBefore: 0.5,
          bufferDurationAfter: 0.5,
        }),
      ],
    });

    const expectedCuts = [
      {
        startTime: 2,
        duration: 2,
        outputStartTime: 0,
        index: 0,
      },
      {
        startTime: 0,
        duration: 2,
        outputStartTime: 2,
        index: 1,
      },
      {
        startTime: 4,
        duration: 2,
        outputStartTime: 4,
        index: 2,
      },
    ];

    expect(cuts).toEqual(expectedCuts);
  });
});
