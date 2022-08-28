import { TakeGroup } from 'sharedTypes';
import { makeBasicWord } from 'sharedUtils';
import { generateTranscriptionChunks } from '../takeDetection';
import transcriptionChunkTestData from './transcriptionChunkTestData.json';

describe('takeDetection', () => {
  it('should generate no chunks when there is no take info', () => {
    const inputWords = [
      makeBasicWord({}),
      makeBasicWord({}),
      makeBasicWord({}),
    ];

    const takeGroups: TakeGroup[] = [];

    expect(generateTranscriptionChunks(inputWords, takeGroups)).toEqual([
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

    const takeGroups: TakeGroup[] = [{ id: 0, activeTakeIndex: 0 }];

    expect(generateTranscriptionChunks(inputWords, takeGroups)).toEqual([
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

    const takeGroups: TakeGroup[] = [{ id: 0, activeTakeIndex: 0 }];

    expect(generateTranscriptionChunks(inputWords, takeGroups)).toEqual([
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

    const takeGroups: TakeGroup[] = [
      { id: 0, activeTakeIndex: 0 },
      { id: 1, activeTakeIndex: 1 },
    ];

    expect(generateTranscriptionChunks(inputWords, takeGroups)).toEqual([
      makeBasicWord({}),
      { activeTakeIndex: 0, id: 0 } as TakeGroup,
      { activeTakeIndex: 1, id: 1 } as TakeGroup,
      makeBasicWord({}),
    ]);
  });

  it('should generate transcription chunks when take groups are separated', () => {
    const inputWords = [
      makeBasicWord({}),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 0 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 0 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 1 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 0, takeIndex: 1 } }),
      makeBasicWord({}),
      makeBasicWord({}),
      makeBasicWord({ takeInfo: { takeGroupId: 1, takeIndex: 0 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 1, takeIndex: 0 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 1, takeIndex: 1 } }),
      makeBasicWord({ takeInfo: { takeGroupId: 1, takeIndex: 1 } }),
      makeBasicWord({}),
    ];

    const takeGroups: TakeGroup[] = [
      { id: 0, activeTakeIndex: 0 },
      { id: 1, activeTakeIndex: 1 },
    ];

    expect(generateTranscriptionChunks(inputWords, takeGroups)).toEqual([
      makeBasicWord({}),
      { activeTakeIndex: 0, id: 0 } as TakeGroup,
      makeBasicWord({}),
      makeBasicWord({}),
      { activeTakeIndex: 1, id: 1 } as TakeGroup,
      makeBasicWord({}),
    ]);
  });

  it('should generate chunks as expected for a complex example', () => {
    const { words, takeGroups, chunks } = transcriptionChunkTestData;

    expect(generateTranscriptionChunks(words, takeGroups)).toEqual(chunks);
  });
});
