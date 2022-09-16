import { JSONTranscription } from '../../types';
import preProcessTranscript from '../preProcess';

describe('Test pre-processing JSON transcript into regular transcript', () => {
  it('should produce expected transcript when given a JSON transcript', () => {
    const jsonTranscript: JSONTranscription = {
      words: [
        {
          word: 'abc',
          startTime: 0,
          duration: 1,
          confidence: 1,
        },
        {
          word: 'def',
          startTime: 1,
          duration: 1,
          confidence: 1,
        },
      ],
    };
    const duration = 2;

    const outputTranscript = preProcessTranscript(jsonTranscript, duration);

    expect(outputTranscript).toEqual({
      duration,
      outputDuration: duration,
      takeGroups: [],
      words: [
        {
          word: 'abc',
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
          word: 'def',
          duration: 1,
          startTime: 1,
          outputStartTime: 1,
          originalIndex: 1,
          pasteKey: 0,
          bufferDurationBefore: 0,
          bufferDurationAfter: 0,
          deleted: false,
          confidence: 1,
          takeInfo: null,
        },
      ],
    });
  });

  it('should fill blank spaces between words, and between first/last words and start/end', () => {
    const jsonTranscript: JSONTranscription = {
      words: [
        {
          word: 'heat',
          startTime: 5,
          duration: 2,
          confidence: 1,
        },
        {
          word: 'from',
          startTime: 8,
          duration: 3,
          confidence: 1,
        },
        {
          word: 'fire',
          startTime: 11.2,
          duration: 0.9,
          confidence: 1,
        },
        {
          word: 'burns',
          startTime: 12.2,
          duration: 0.5,
          confidence: 1,
        },
      ],
    };
    const duration = 15.77;

    const outputTranscript = preProcessTranscript(jsonTranscript, duration);

    expect(outputTranscript).toEqual({
      duration,
      outputDuration: duration,
      takeGroups: [],
      words: [
        {
          word: 'heat',
          duration: 2,
          startTime: 5,
          outputStartTime: 0,
          originalIndex: 0,
          pasteKey: 0,
          bufferDurationBefore: 5,
          bufferDurationAfter: 0.8,
          deleted: false,
          confidence: 1,
          takeInfo: null,
        },
        {
          word: 'from',
          duration: 3,
          startTime: 8,
          outputStartTime: 7.8,
          originalIndex: 1,
          pasteKey: 0,
          bufferDurationBefore: 0.2,
          bufferDurationAfter: 0,
          deleted: false,
          confidence: 1,
          takeInfo: null,
        },
        {
          word: 'fire',
          duration: 0.9,
          startTime: 11.2,
          outputStartTime: 11,
          originalIndex: 2,
          pasteKey: 0,
          bufferDurationBefore: 0.2,
          bufferDurationAfter: 0,
          deleted: false,
          confidence: 1,
          takeInfo: null,
        },
        {
          word: 'burns',
          duration: 0.5,
          startTime: 12.2,
          outputStartTime: 12.1,
          originalIndex: 3,
          pasteKey: 0,
          bufferDurationBefore: 0.1,
          bufferDurationAfter: 3.07,
          deleted: false,
          confidence: 1,
          takeInfo: null,
        },
      ],
    });
  });
});
