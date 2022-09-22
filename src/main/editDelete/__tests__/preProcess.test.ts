import { makeBasicWord } from 'sharedUtils';
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

  it('should inject pauses when there are large gaps', () => {
    const jsonTranscript: JSONTranscription = {
      words: [
        makeBasicWord({ word: 'first', startTime: 3, duration: 2 }),
        makeBasicWord({ word: 'second', startTime: 8, duration: 2 }),
        makeBasicWord({ word: 'third', startTime: 10.1, duration: 0.9 }),
      ],
    };
    const duration = 12;

    const maxThreshold = 0.5;
    const defaultThreshold = 0.2;

    const outputTranscript = preProcessTranscript(
      jsonTranscript,
      duration,
      maxThreshold,
      defaultThreshold
    );

    console.log(outputTranscript);

    expect(outputTranscript).toEqual({
      duration: 12,
      outputDuration: 12,
      takeGroups: [],
      words: [
        makeBasicWord({
          word: null,
          startTime: 0,
          outputStartTime: 0,
          duration: 2.8,
          originalIndex: 0,
        }),
        makeBasicWord({
          word: 'first',
          startTime: 3,
          outputStartTime: 2.8,
          duration: 2,
          bufferDurationBefore: 0.2,
          bufferDurationAfter: 0.2,
          originalIndex: 1,
        }),
        makeBasicWord({
          word: null,
          startTime: 5.2,
          outputStartTime: 5.2,
          duration: 2.6,
          originalIndex: 2,
        }),
        makeBasicWord({
          word: 'second',
          startTime: 8,
          outputStartTime: 7.8,
          duration: 2,
          bufferDurationBefore: 0.2,
          bufferDurationAfter: 0,
          originalIndex: 3,
        }),
        makeBasicWord({
          word: 'third',
          startTime: 10.1,
          outputStartTime: 10,
          duration: 0.9,
          bufferDurationBefore: 0.1,
          bufferDurationAfter: 0.2,
          originalIndex: 4,
        }),
        makeBasicWord({
          word: null,
          startTime: 11.2,
          outputStartTime: 11.2,
          duration: 0.8,
          originalIndex: 5,
        }),
      ],
    });
  });
});
