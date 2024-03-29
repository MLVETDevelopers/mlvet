import { Transcription } from '../../../sharedTypes';
import { constructEDL } from '../exportToEDL';

describe('Test exporting', () => {
  it('should produce expected EDL (merging words, if no cuts) after EDL construction', async () => {
    /*
    For EDL Export Testing, we strictly use /t because /t and a bunch of spaces are strictly different things.

    Also, we are assuming 30fps videos
    The way constructEDL gets FPS is by calling ffmpeg, which is kind of a hassle to try to work around for the sake of testing.
    */
    const transcription: Transcription = {
      duration: 100,
      outputDuration: 100,
      takeGroups: [],
      words: [
        {
          word: ' ',
          startTime: 0,
          duration: 0.5,
          outputStartTime: 0,
          deleted: false,
          originalIndex: 0,
          pasteKey: 0,
          bufferDurationBefore: 0,
          bufferDurationAfter: 0,
          confidence: 1,
          takeInfo: null,
        },
        {
          word: 'abc',
          duration: 1,
          startTime: 0.5,
          outputStartTime: 0.5,
          originalIndex: 1,
          pasteKey: 0,
          bufferDurationBefore: 0,
          bufferDurationAfter: 0,
          deleted: false,
          confidence: 1,
          takeInfo: null,
        },
      ],
    };

    const mediaFilePath = 'PLACEHOLDER_PATH';

    const outputEDL = await constructEDL(
      'PLACEHOLDER SEQUENCE NAME',
      transcription,
      mediaFilePath,
      null
    );

    const expectedEDL =
      'TITLE: PLACEHOLDER SEQUENCE NAME\n' +
      'FCM: NON-DROP FRAME\n\n' +
      '001  AX       AA/V  C        00:00:00:00 00:00:01:15 00:00:00:00 00:00:01:15\n' +
      '* FROM CLIP NAME: PLACEHOLDER_PATH\n\n';

    expect(outputEDL).toEqual(expectedEDL);
  });

  it('should produce expected EDL (with cuts) after EDL construction', async () => {
    const transcription: Transcription = {
      duration: 100,
      outputDuration: 100,
      takeGroups: [],
      words: [
        {
          word: 'abc',
          duration: 1,
          startTime: 0.5,
          outputStartTime: 0.5,
          originalIndex: 1,
          pasteKey: 0,
          bufferDurationBefore: 0,
          bufferDurationAfter: 0,
          deleted: false,
          confidence: 1,
          takeInfo: null,
        },
        {
          word: 'def',
          startTime: 0,
          duration: 0.5,
          outputStartTime: 0,
          deleted: false,
          originalIndex: 0,
          pasteKey: 0,
          bufferDurationBefore: 0,
          bufferDurationAfter: 0,
          confidence: 1,
          takeInfo: null,
        },
      ],
    };

    const mediaFilePath = 'PLACEHOLDER_PATH';

    const outputEDL = await constructEDL(
      'PLACEHOLDER SEQUENCE NAME',
      transcription,
      mediaFilePath,
      null
    );

    const expectedEDL =
      'TITLE: PLACEHOLDER SEQUENCE NAME\n' +
      'FCM: NON-DROP FRAME\n\n' +
      '001  AX       AA/V  C        00:00:00:15 00:00:01:15 00:00:00:00 00:00:01:00\n' +
      '* FROM CLIP NAME: PLACEHOLDER_PATH\n\n' +
      '002  AX       AA/V  C        00:00:00:00 00:00:00:15 00:00:01:00 00:00:01:15\n' +
      '* FROM CLIP NAME: PLACEHOLDER_PATH\n\n';

    expect(outputEDL).toEqual(expectedEDL);
  });
});
