import '@testing-library/jest-dom';
import { Cut, Transcription } from '../../sharedTypes';
import convertTranscriptToCuts from '../transcriptToCuts';

const mockTranscriptionUnedited: Transcription = {
  confidence: -977.0841064453125,
  duration: 100,
  words: [
    {
      word: ' ',
      startTime: 0,
      duration: 0.48,
      outputStartTime: 0,
      bufferDurationBefore: 0,
      bufferDurationAfter: 0,
      deleted: false,
      originalIndex: 0,
      pasteCount: 0,
      fileName: 'sample.mp4',
    },
    {
      word: 'that',
      duration: 0.08,
      startTime: 0.48,
      outputStartTime: 0.48,
      bufferDurationBefore: 0,
      bufferDurationAfter: 0,
      originalIndex: 1,
      pasteCount: 0,
      deleted: false,
      fileName: 'sample.mp4',
    },
    {
      word: ' ',
      startTime: 0.56,
      duration: 0.04,
      outputStartTime: 0.56,
      deleted: false,
      bufferDurationBefore: 0,
      bufferDurationAfter: 0,
      originalIndex: 2,
      pasteCount: 0,
      fileName: 'sample.mp4',
    },
    {
      word: 'was',
      duration: 0.1,
      startTime: 0.6,
      outputStartTime: 0.6,
      bufferDurationBefore: 0,
      bufferDurationAfter: 0,
      originalIndex: 3,
      pasteCount: 0,
      deleted: false,
      fileName: 'sample.mp4',
    },
  ],
};

const mockTranscriptionEdited: Transcription = {
  confidence: -977.0841064453125,
  duration: 100,
  words: [
    {
      word: ' ',
      startTime: 0,
      duration: 0.48,
      outputStartTime: 0,
      bufferDurationBefore: 0,
      bufferDurationAfter: 0,
      originalIndex: 0,
      pasteCount: 0,
      deleted: false,
      fileName: 'sample.mp4',
    },
    {
      word: 'that',
      duration: 0.08,
      startTime: 0.48,
      outputStartTime: 0.48,
      bufferDurationBefore: 0,
      bufferDurationAfter: 0,
      originalIndex: 1,
      pasteCount: 0,
      deleted: false,
      fileName: 'sample.mp4',
    },
    {
      word: ' ',
      startTime: 0.56,
      duration: 0.04,
      outputStartTime: 0.56,
      deleted: false,
      bufferDurationBefore: 0,
      bufferDurationAfter: 0,
      originalIndex: 2,
      pasteCount: 0,
      fileName: 'sample.mp4',
    },
    {
      word: 'was',
      duration: 0.1,
      startTime: 0.6,
      outputStartTime: 0.6,
      bufferDurationBefore: 0,
      bufferDurationAfter: 0,
      originalIndex: 3,
      pasteCount: 0,
      deleted: false,
      fileName: 'sample.mp4',
    },
    {
      word: ' ',
      startTime: 0.7,
      duration: 0.08,
      outputStartTime: 0.7,
      deleted: false,
      bufferDurationBefore: 0,
      bufferDurationAfter: 0,
      originalIndex: 4,
      pasteCount: 0,
      fileName: 'sample.mp4',
    },
    {
      word: 'actually',
      duration: 0.28,
      startTime: 0.78,
      outputStartTime: 0.78,
      bufferDurationBefore: 0,
      bufferDurationAfter: 0,
      originalIndex: 5,
      pasteCount: 0,
      deleted: true,
      fileName: 'sample.mp4',
    },
    {
      word: ' ',
      startTime: 1.06,
      duration: 0.06,
      outputStartTime: 0.78,
      deleted: false,
      bufferDurationBefore: 0,
      bufferDurationAfter: 0,
      originalIndex: 6,
      pasteCount: 0,
      fileName: 'sample.mp4',
    },
  ],
};

const compareCuts = (cut1: Cut, cut2: Cut) => {
  expect(cut1.startTime).toBeCloseTo(cut2.startTime);
  expect(cut1.duration).toBeCloseTo(cut2.duration);
  expect(cut1.outputStartTime).toBeCloseTo(cut2.outputStartTime);
  expect(cut1.index).toEqual(cut2.index);
};

describe('transcript To Cuts', () => {
  it('Unedited transcript', async () => {
    const cuts = convertTranscriptToCuts(mockTranscriptionUnedited);

    const expectedCuts = [
      {
        startTime: 0,
        duration: 0.7,
        outputStartTime: 0,
        index: 0,
      },
    ];

    expect(cuts).toEqual(expectedCuts);
  });

  it('Edited transcript - deleted word - 2 cuts', async () => {
    const cuts = convertTranscriptToCuts(mockTranscriptionEdited);

    const expectedCuts: Cut[] = [
      {
        startTime: 0,
        duration: 0.78,
        outputStartTime: 0,
        index: 0,
      },
      {
        startTime: 1.06,
        duration: 0.06,
        outputStartTime: 0.78,
        index: 1,
      },
    ];

    expectedCuts.forEach((expectedCut: Cut) => {
      const { index } = expectedCut;
      expect(cuts[index]).toBeTruthy();
      compareCuts(expectedCut, cuts[index]);
    });
  });
});
