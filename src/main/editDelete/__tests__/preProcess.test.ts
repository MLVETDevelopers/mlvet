import preProcessTranscript from '../preProcess';

describe('Test pre-processing JSON transcript into regular transcript', () => {
  it('should produce expected transcript when given a JSON transcript', () => {
    const jsonTranscript = {
      confidence: 1,
      words: [
        {
          word: 'abc',
          start_time: 0,
          duration: 1,
        },
        {
          word: 'def',
          start_time: 1,
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
      words: [
        {
          deleted: false,
          duration: 1,
          fileName: 'PLACEHOLDER FILENAME',
          key: '0',
          outputStartTime: 0,
          startTime: 0,
          word: 'abc',
        },
        {
          deleted: false,
          duration: 1,
          fileName: 'PLACEHOLDER FILENAME',
          key: '1',
          outputStartTime: 1,
          startTime: 1,
          word: 'def',
        },
      ],
    });
  });

  it('should fill blank spaces between words, and between last word and end', () => {
    const jsonTranscript = {
      confidence: -7,
      words: [
        {
          word: 'heat',
          start_time: 5,
          duration: 2,
        },
        {
          word: 'from',
          start_time: 8,
          duration: 3,
        },
        {
          word: 'fire',
          start_time: 11.2,
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
      words: [
        {
          deleted: false,
          duration: 3,
          fileName: 'PLACEHOLDER FILENAME',
          key: '0',
          outputStartTime: 5,
          startTime: 5,
          word: 'heat',
        },
        {
          deleted: false,
          duration: 3.2,
          fileName: 'PLACEHOLDER FILENAME',
          key: '1',
          outputStartTime: 8,
          startTime: 8,
          word: 'from',
        },
        {
          deleted: false,
          duration: 4.57,
          fileName: 'PLACEHOLDER FILENAME',
          key: '2',
          outputStartTime: 11.2,
          startTime: 11.2,
          word: 'fire',
        },
      ],
    });
  });
});
