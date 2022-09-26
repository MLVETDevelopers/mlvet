import { mapInRange } from '../../sharedUtils';
import { IndexRange, TakeGroup, Word } from '../../sharedTypes';

export interface InjectableTake {
  wordRange: IndexRange;
}

export interface InjectableTakeGroup {
  takes: InjectableTake[];
}

const mockTakeGroups: InjectableTakeGroup[] = [
  {
    takes: [
      { wordRange: { startIndex: 0, endIndex: 3 } },
      { wordRange: { startIndex: 3, endIndex: 6 } },
      { wordRange: { startIndex: 6, endIndex: 10 } },
    ],
  },
  {
    takes: [
      { wordRange: { startIndex: 20, endIndex: 24 } },
      { wordRange: { startIndex: 24, endIndex: 100 } },
    ],
  },
];

const injectTakeInfo: (
  words: Word[],
  takeGroups?: InjectableTakeGroup[]
) => { words: Word[]; takeGroups: TakeGroup[] } = (
  words,
  takeGroups = mockTakeGroups
) => {
  let wordsCopy = [...words];

  // Inject take info into words
  takeGroups.forEach((takeGroup, takeGroupIndex) => {
    takeGroup.takes.forEach((take, takeIndex) => {
      const { wordRange } = take;

      wordsCopy = mapInRange(
        wordsCopy,
        (word) => ({
          ...word,
          takeInfo: { takeGroupId: takeGroupIndex, takeIndex },
        }),
        wordRange
      );
    });
  });

  // Convert a list of InjectableTakeGroup into a list of regular TakeGroup
  const strippedDownTakeGroups: TakeGroup[] = takeGroups.map(
    (_, takeGroupIndex) => ({
      id: takeGroupIndex,
      activeTakeIndex: 0,
      takeSelected: false,
    })
  );

  return {
    words: wordsCopy,
    takeGroups: strippedDownTakeGroups,
  };
};

export default injectTakeInfo;
