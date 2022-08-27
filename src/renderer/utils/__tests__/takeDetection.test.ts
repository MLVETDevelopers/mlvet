import { TakeGroup } from 'sharedTypes';
import { makeBasicWord } from 'sharedUtils';
import { generateTranscriptionChunks } from '../takeDetection';

describe('takeDetection', () => {
  it('should generate no chunks when there is no take info', () => {
    const inputWords = [
      makeBasicWord({}),
      makeBasicWord({}),
      makeBasicWord({}),
    ];

    expect(generateTranscriptionChunks(inputWords)).toEqual([
      makeBasicWord({}),
      makeBasicWord({}),
      makeBasicWord({}),
    ]);
  });

  it('should generate transcription chunks when there is take info - single take', () => {
    const inputWords = [
      makeBasicWord({}),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 0 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 0 } }),
      makeBasicWord({}),
    ];

    expect(generateTranscriptionChunks(inputWords)).toEqual([
      makeBasicWord({}),
      { activeTakeIndex: 0, id: 0 } as TakeGroup,
      makeBasicWord({}),
    ]);
  });

  it('should generate transcription chunks when there is take info - two takes in one group', () => {
    const inputWords = [
      makeBasicWord({}),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 0 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 0 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 1 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 1 } }),
      makeBasicWord({}),
    ];

    expect(generateTranscriptionChunks(inputWords)).toEqual([
      makeBasicWord({}),
      { activeTakeIndex: 0, id: 0 } as TakeGroup,
      makeBasicWord({}),
    ]);
  });

  it('should generate transcription chunks when there is take info - four takes, two in each group', () => {
    const inputWords = [
      makeBasicWord({}),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 0 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 0 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 1 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 1 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 1, takeIndex: 0 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 1, takeIndex: 0 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 1, takeIndex: 1 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 1, takeIndex: 1 } }),
      makeBasicWord({}),
    ];

    expect(generateTranscriptionChunks(inputWords)).toEqual([
      makeBasicWord({}),
      { activeTakeIndex: 0, id: 0 } as TakeGroup,
      { activeTakeIndex: 0, id: 1 } as TakeGroup,
      makeBasicWord({}),
    ]);
  });
});
