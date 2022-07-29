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
          word: ' ',
          startTime: 0,
          duration: 0,
          outputStartTime: 0,
          deleted: false,
          key: outputTranscript.words[0].key,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'Abc.',
          duration: 1,
          startTime: 0,
          outputStartTime: 0,
          key: outputTranscript.words[1].key,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 1,
          duration: 0,
          outputStartTime: 1,
          deleted: false,
          key: outputTranscript.words[2].key,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'Def.',
          duration: 1,
          startTime: 1,
          outputStartTime: 1,
          key: outputTranscript.words[3].key,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 2,
          duration: 0,
          outputStartTime: 2,
          deleted: false,
          key: outputTranscript.words[4].key,
          fileName: 'PLACEHOLDER FILENAME',
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
          word: ' ',
          startTime: 0,
          duration: 5,
          outputStartTime: 0,
          deleted: false,
          key: outputTranscript.words[0].key,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'Heat.',
          duration: 2,
          startTime: 5,
          outputStartTime: 5,
          key: outputTranscript.words[1].key,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 7,
          duration: 1,
          outputStartTime: 7,
          deleted: false,
          key: outputTranscript.words[2].key,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'From',
          duration: 3,
          startTime: 8,
          outputStartTime: 8,
          key: outputTranscript.words[3].key,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 11,
          duration: 0.2,
          outputStartTime: 11,
          deleted: false,
          key: outputTranscript.words[4].key,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'fire.',
          duration: 0.9,
          startTime: 11.2,
          outputStartTime: 11.2,
          key: outputTranscript.words[5].key,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 12.1,
          duration: 3.67,
          outputStartTime: 12.1,
          deleted: false,
          key: outputTranscript.words[6].key,
          fileName: 'PLACEHOLDER FILENAME',
        },
      ],
    });
  });

  it('should punctuate the transcript with a comma after "from"', () => {
    const jsonTranscript = {
      confidence: -7,
      words: [
        {
          word: 'heat',
          start_time: 5,
          duration: 2.5,
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
          word: ' ',
          startTime: 0,
          duration: 5,
          outputStartTime: 0,
          deleted: false,
          key: outputTranscript.words[0].key,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'Heat.',
          duration: 2.5,
          startTime: 5,
          outputStartTime: 5,
          key: outputTranscript.words[1].key,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 7.5,
          duration: 0.5,
          outputStartTime: 7.5,
          deleted: false,
          key: outputTranscript.words[2].key,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'From,',
          duration: 3,
          startTime: 8,
          outputStartTime: 8,
          key: outputTranscript.words[3].key,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 11,
          duration: 0.2,
          outputStartTime: 11,
          deleted: false,
          key: outputTranscript.words[4].key,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'fire.',
          duration: 0.9,
          startTime: 11.2,
          outputStartTime: 11.2,
          key: outputTranscript.words[5].key,
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 12.1,
          duration: 3.67,
          outputStartTime: 12.1,
          deleted: false,
          key: outputTranscript.words[6].key,
          fileName: 'PLACEHOLDER FILENAME',
        },
      ],
    });
  });
});
