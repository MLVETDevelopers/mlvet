import liveProcessTranscript from '../liveProcess';

describe('Test live-processing Transcription outputStartTime after edit/delete', () => {
  it('should produce expected Transcription after delete operation', () => {
    const inputTranscript = {
      confidence: 1,
      words: [
        {
          word: ' ',
          startTime: 0,
          duration: 0.5,
          outputStartTime: 0,
          deleted: false,
          key: '0',
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'abc',
          duration: 1,
          startTime: 0.5,
          outputStartTime: 0.5,
          key: '1',
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 1.5,
          duration: 0.5,
          outputStartTime: 1.5,
          deleted: false,
          key: '2',
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'def',
          duration: 1,
          startTime: 2,
          outputStartTime: 2,
          key: '3',
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 3,
          duration: 0.5,
          outputStartTime: 3,
          deleted: false,
          key: '4',
          fileName: 'PLACEHOLDER FILENAME',
        },
      ],
    };

    inputTranscript.words[1].deleted = true;
    const outputTranscript = liveProcessTranscript(inputTranscript);

    expect(outputTranscript).toEqual({
      confidence: 1,
      words: [
        {
          word: ' ',
          startTime: 0,
          duration: 0.5,
          outputStartTime: 0,
          deleted: false,
          key: '0',
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'abc',
          duration: 1,
          startTime: 0.5,
          outputStartTime: 0.5,
          key: '1',
          deleted: true,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 1.5,
          duration: 0.5,
          outputStartTime: 0.5,
          deleted: false,
          key: '2',
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'def',
          duration: 1,
          startTime: 2,
          outputStartTime: 1,
          key: '3',
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 3,
          duration: 0.5,
          outputStartTime: 2,
          deleted: false,
          key: '4',
          fileName: 'PLACEHOLDER FILENAME',
        },
      ],
    });
  });

  it('should produce expected Transcription after edit operation', () => {
    const inputTranscript = {
      confidence: 1,
      words: [
        {
          word: ' ',
          startTime: 0,
          duration: 0.5,
          outputStartTime: 0,
          deleted: false,
          key: '0',
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'abc',
          duration: 1,
          startTime: 0.5,
          outputStartTime: 0.5,
          key: '1',
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 1.5,
          duration: 0.5,
          outputStartTime: 1.5,
          deleted: false,
          key: '2',
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'def',
          duration: 1,
          startTime: 2,
          outputStartTime: 2,
          key: '3',
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 3,
          duration: 0.5,
          outputStartTime: 3,
          deleted: false,
          key: '4',
          fileName: 'PLACEHOLDER FILENAME',
        },
      ],
    };

    const [, movedWord1] = inputTranscript.words;
    const [movedWord0] = inputTranscript.words;
    inputTranscript.words[1] = movedWord0;
    inputTranscript.words[0] = movedWord1;
    const outputTranscript = liveProcessTranscript(inputTranscript);

    expect(outputTranscript).toEqual({
      confidence: 1,
      words: [
        {
          word: 'abc',
          duration: 1,
          startTime: 0.5,
          outputStartTime: 0,
          key: '1',
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 0,
          duration: 0.5,
          outputStartTime: 1,
          deleted: false,
          key: '0',
          fileName: 'PLACEHOLDER FILENAME',
        },

        {
          word: ' ',
          startTime: 1.5,
          duration: 0.5,
          outputStartTime: 1.5,
          deleted: false,
          key: '2',
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: 'def',
          duration: 1,
          startTime: 2,
          outputStartTime: 2,
          key: '3',
          deleted: false,
          fileName: 'PLACEHOLDER FILENAME',
        },
        {
          word: ' ',
          startTime: 3,
          duration: 0.5,
          outputStartTime: 3,
          deleted: false,
          key: '4',
          fileName: 'PLACEHOLDER FILENAME',
        },
      ],
    });
  });
});
