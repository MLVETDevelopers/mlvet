import { TakeGroup } from 'sharedTypes';
import { makeBasicWord } from 'sharedUtils';
import { updateOutputTimes } from 'transcriptProcessing/updateOutputTimes';

describe('updateOutputTimes', () => {
  it('should update output start times appropriately when there are no take groups', () => {
    const inputWords = [
      makeBasicWord({ startTime: 0, duration: 1 }),
      makeBasicWord({ startTime: 1, duration: 1 }),
      makeBasicWord({ startTime: 2, duration: 1 }),
    ];

    const takeGroups: TakeGroup[] = [];

    expect(updateOutputTimes(inputWords, takeGroups)).toEqual({
      words: [
        makeBasicWord({ startTime: 0, outputStartTime: 0, duration: 1 }),
        makeBasicWord({ startTime: 1, outputStartTime: 1, duration: 1 }),
        makeBasicWord({ startTime: 2, outputStartTime: 2, duration: 1 }),
      ],
      outputDuration: 3,
    });
  });

  it('should update output start times appropriately when there is a single take group with a single active take', () => {
    const inputWords = [
      makeBasicWord({ startTime: 0, duration: 1 }),
      makeBasicWord({
        startTime: 1,
        duration: 1,
        takeInfo: { takeGroupId: 0, takeIndex: 0 },
      }),
      makeBasicWord({ startTime: 2, duration: 1 }),
    ];

    const takeGroups: TakeGroup[] = [
      { activeTakeIndex: 0, id: 0, takeSelected: false },
    ];

    expect(updateOutputTimes(inputWords, takeGroups)).toEqual({
      words: [
        makeBasicWord({ startTime: 0, outputStartTime: 0, duration: 1 }),
        makeBasicWord({
          startTime: 1,
          outputStartTime: 1,
          duration: 1,
          takeInfo: { takeGroupId: 0, takeIndex: 0 },
        }),
        makeBasicWord({ startTime: 2, outputStartTime: 2, duration: 1 }),
      ],
      outputDuration: 3,
    });
  });

  it('should update output start times appropriately when there is a single take group with two takes, one of them inactive', () => {
    const inputWords = [
      makeBasicWord({ startTime: 0, duration: 1 }),
      makeBasicWord({
        startTime: 1,
        duration: 1,
        takeInfo: { takeGroupId: 0, takeIndex: 0 },
      }),
      makeBasicWord({
        startTime: 2,
        duration: 1,
        takeInfo: { takeGroupId: 0, takeIndex: 1 },
      }),
      makeBasicWord({ startTime: 2, duration: 1 }),
    ];

    const takeGroups: TakeGroup[] = [
      { activeTakeIndex: 0, id: 0, takeSelected: false },
    ];

    expect(updateOutputTimes(inputWords, takeGroups)).toEqual({
      words: [
        makeBasicWord({ startTime: 0, outputStartTime: 0, duration: 1 }),
        makeBasicWord({
          startTime: 1,
          outputStartTime: 1,
          duration: 1,
          takeInfo: { takeGroupId: 0, takeIndex: 0 },
        }),
        makeBasicWord({
          startTime: 2,
          outputStartTime: 0,
          duration: 1,
          takeInfo: { takeGroupId: 0, takeIndex: 1 },
        }),
        makeBasicWord({ startTime: 2, outputStartTime: 2, duration: 1 }),
      ],
      outputDuration: 3,
    });
  });

  it('should update output start times appropriately when there are two take groups with two takes each', () => {
    const inputWords = [
      makeBasicWord({ startTime: 0, duration: 1 }),
      makeBasicWord({
        startTime: 1,
        duration: 1,
        takeInfo: { takeGroupId: 0, takeIndex: 0 },
      }),
      makeBasicWord({
        startTime: 2,
        duration: 1,
        takeInfo: { takeGroupId: 0, takeIndex: 1 },
      }),
      makeBasicWord({
        startTime: 3,
        duration: 1,
        takeInfo: { takeGroupId: 0, takeIndex: 1 },
      }),
      makeBasicWord({ startTime: 4, duration: 1 }),
      makeBasicWord({
        startTime: 5,
        duration: 1,
        takeInfo: { takeGroupId: 1, takeIndex: 0 },
      }),
      makeBasicWord({
        startTime: 6,
        duration: 1,
        takeInfo: { takeGroupId: 1, takeIndex: 1 },
      }),
      makeBasicWord({ startTime: 7, duration: 1 }),
    ];

    const takeGroups: TakeGroup[] = [
      { activeTakeIndex: 0, id: 0, takeSelected: true },
      { activeTakeIndex: 1, id: 1, takeSelected: true },
    ];

    expect(updateOutputTimes(inputWords, takeGroups)).toEqual({
      words: [
        makeBasicWord({ startTime: 0, outputStartTime: 0, duration: 1 }),
        makeBasicWord({
          startTime: 1,
          outputStartTime: 1,
          duration: 1,
          takeInfo: { takeGroupId: 0, takeIndex: 0 },
        }),
        makeBasicWord({
          startTime: 2,
          outputStartTime: 0,
          duration: 1,
          takeInfo: { takeGroupId: 0, takeIndex: 1 },
        }),
        makeBasicWord({
          startTime: 3,
          outputStartTime: 0,
          duration: 1,
          takeInfo: { takeGroupId: 0, takeIndex: 1 },
        }),
        makeBasicWord({ startTime: 4, outputStartTime: 2, duration: 1 }),
        makeBasicWord({
          startTime: 5,
          outputStartTime: 0,
          duration: 1,
          takeInfo: { takeGroupId: 1, takeIndex: 0 },
        }),
        makeBasicWord({
          startTime: 6,
          outputStartTime: 3,
          duration: 1,
          takeInfo: { takeGroupId: 1, takeIndex: 1 },
        }),
        makeBasicWord({ startTime: 7, outputStartTime: 4, duration: 1 }),
      ],
      outputDuration: 5,
    });
  });
});
