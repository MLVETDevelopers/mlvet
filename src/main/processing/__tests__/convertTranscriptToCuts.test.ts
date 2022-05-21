import convertTranscriptToCuts from '../transcriptToCuts';

describe('Test convert transcription to cuts', () => {
  it('should produce one cut when given a transcription with continues time', () => {
    const inputTranscription = {
      confidence: 1,
      words: [
        {
          word: 'abc',
          startTime: 0,
          duration: 0.5,
          outputStartTime: 0,
          deleted: false,
          key: '0',
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'def',
          startTime: 0.5,
          duration: 1,
          outputStartTime: 0.5,
          key: '1',
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'qwe',
          startTime: 1.5,
          duration: 1,
          outputStartTime: 0.5,
          key: '1',
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
      ],
    };

    const outputCuts = convertTranscriptToCuts(inputTranscription);

    const expectCuts = [
      {
        startTime: 0,
        duration: 2.5,
      },
    ];

    expect(outputCuts).toEqual(expectCuts);
  });

  it('should produce expected cuts when given a transcription with discrete time', () => {
    const inputTranscription = {
      confidence: 1,
      words: [
        {
          word: 'abc',
          startTime: 0,
          duration: 0.5,
          outputStartTime: 0,
          deleted: false,
          key: '0',
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'def',
          startTime: 1,
          duration: 1,
          outputStartTime: 0.5,
          key: '1',
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'qwe',
          startTime: 2,
          duration: 0.5,
          outputStartTime: 0.5,
          key: '1',
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
      ],
    };

    const outputCuts = convertTranscriptToCuts(inputTranscription);

    const expectCuts = [
      {
        startTime: 0,
        duration: 0.5,
      },
      {
        startTime: 1,
        duration: 1.5,
      },
    ];

    expect(outputCuts).toEqual(expectCuts);
  });
});
