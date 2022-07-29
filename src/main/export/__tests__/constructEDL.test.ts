import { constructEDL } from '../export';

describe('Test exporting', () => {
  it('should produce expected EDL (merging words, if no cuts) after EDL construction', () => {
    /*
    For EDL Export Testing, we strictly use /t because /t and a bunch of spaces are strictly different things.
    */
    const inputProj = {
      id: 69,
      schemaVersion: 69,
      name: 'test',
      transcription: {
        confidence: 1,
        duration: 100,
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
        ],
      },
      mediaFilePath: 'PLACEHOLDER_PATH',
    };

    const outputEDL = constructEDL(
      'PLACEHOLDER SEQUENCE NAME',
      inputProj.transcription,
      inputProj.mediaFilePath,
      null
    );

    const expectedEDL =
      'TITLE: PLACEHOLDER SEQUENCE NAME\n' +
      'FCM: NON-DROP FRAME\n\n' +
      '001  AX       AA/V  C        00:00:00:00 00:00:01:50 00:00:00:00 00:00:01:50\n' +
      '* FROM CLIP NAME: PLACEHOLDER_PATH\n\n';

    expect(outputEDL).toEqual(expectedEDL);
  });

  it('should produce expected EDL (with cuts) after EDL construction', () => {
    const inputProj = {
      id: 69,
      schemaVersion: 69,
      name: 'test',
      transcription: {
        confidence: 1,
        duration: 100,
        words: [
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
            startTime: 0,
            duration: 0.5,
            outputStartTime: 0,
            deleted: false,
            key: '0',
            fileName: 'PLACEHOLDER FILENAME',
          },
        ],
      },
      mediaFilePath: 'PLACEHOLDER_PATH',
    };

    const outputEDL = constructEDL(
      'PLACEHOLDER SEQUENCE NAME',
      inputProj.transcription,
      inputProj.mediaFilePath,
      null
    );

    const expectedEDL =
      'TITLE: PLACEHOLDER SEQUENCE NAME\n' +
      'FCM: NON-DROP FRAME\n\n' +
      '001  AX       AA/V  C        00:00:00:50 00:00:01:50 00:00:00:00 00:00:01:00\n' +
      '* FROM CLIP NAME: PLACEHOLDER_PATH\n\n' +
      '002  AX       AA/V  C        00:00:00:00 00:00:00:50 00:00:01:00 00:00:01:50\n' +
      '* FROM CLIP NAME: PLACEHOLDER_PATH\n\n';

    expect(outputEDL).toEqual(expectedEDL);
  });
});
