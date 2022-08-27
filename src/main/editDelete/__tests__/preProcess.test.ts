import { JSONTranscription } from '../../types';
import preProcessTranscript from '../preProcess';

describe('Test pre-processing JSON transcript into regular transcript', () => {
  it('should produce expected transcript when given a JSON transcript', () => {
    const jsonTranscript: JSONTranscription = {
      confidence: 1,
      words: [
        {
          word: 'abc',
          startTime: 0,
          duration: 1,
        },
        {
          word: 'def',
          startTime: 1,
          duration: 1,
        },
      ],
    };
    const duration = 2;

    const outputTranscript = preProcessTranscript(
      jsonTranscript,
      duration,
      'PLACEHOLDER FILENAME'
    );

    expect(outputTranscript).toEqual({
      confidence: 1,
      duration,
      outputDuration: duration,
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
          fileName: 'PLACEHOLDER FILENAME',
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
          fileName: 'PLACEHOLDER FILENAME',
        },
      ],
    });
  });

  it('should fill blank spaces between words, and between first/last words and start/end', () => {
    const jsonTranscript: JSONTranscription = {
      confidence: -7,
      words: [
        {
          word: 'heat',
          startTime: 5,
          duration: 2,
        },
        {
          word: 'from',
          startTime: 8,
          duration: 3,
        },
        {
          word: 'fire',
          startTime: 11.2,
          duration: 0.9,
        },
      ],
    };
    const duration = 15.77;

    const outputTranscript = preProcessTranscript(
      jsonTranscript,
      duration,
      'PLACEHOLDER FILENAME'
    );

    expect(outputTranscript).toEqual({
      confidence: -7,
      duration,
      outputDuration: duration,
      words: [
        {
          word: 'heat',
          duration: 2,
          startTime: 5,
          outputStartTime: 0,
          originalIndex: 0,
          pasteKey: 0,
          bufferDurationBefore: 5,
          bufferDurationAfter: 0.5,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'from',
          duration: 3,
          startTime: 8,
          outputStartTime: 7.5,
          originalIndex: 1,
          pasteKey: 0,
          bufferDurationBefore: 0.5,
          bufferDurationAfter: 0.1,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'fire',
          duration: 0.9,
          startTime: 11.2,
          outputStartTime: 11.1,
          originalIndex: 2,
          pasteKey: 0,
          bufferDurationBefore: 0.1,
          bufferDurationAfter: 3.67,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
      ],
    });
  });

  it('should punctuate the transcript with a comma after "from"', () => {
    const jsonTranscript: JSONTranscription = {
      confidence: -7,
      words: [
        {
          word: 'heat',
          startTime: 5,
          duration: 2.5,
        },
        {
          word: 'from',
          startTime: 8,
          duration: 3,
        },
        {
          word: 'fire',
          startTime: 11.2,
          duration: 0.9,
        },
      ],
    };
    const duration = 15.77;

    const outputTranscript = preProcessTranscript(
      jsonTranscript,
      duration,
      'PLACEHOLDER FILENAME'
    );

    expect(outputTranscript).toEqual({
      confidence: -7,
      duration,
      outputDuration: duration,
      words: [
        {
          word: 'heat',
          duration: 2.5,
          startTime: 5,
          outputStartTime: 0,
          originalIndex: 0,
          pasteKey: 0,
          bufferDurationBefore: 5,
          bufferDurationAfter: 0.25,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'from',
          duration: 3,
          startTime: 8,
          outputStartTime: 7.75,
          originalIndex: 1,
          pasteKey: 0,
          bufferDurationBefore: 0.25,
          bufferDurationAfter: 0.1,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'fire',
          duration: 0.9,
          startTime: 11.2,
          outputStartTime: 11.1,
          originalIndex: 2,
          pasteKey: 0,
          bufferDurationBefore: 0.1,
          bufferDurationAfter: 3.67,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
      ],
    });
  });
});
