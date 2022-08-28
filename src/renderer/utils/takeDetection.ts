import { TakeGroup, Word } from 'sharedTypes';

export type TranscriptionChunk = TakeGroup | Word;

// TODO: a bit hacky, do this better
export function isTakeGroup(chunk: TranscriptionChunk): chunk is TakeGroup {
  return 'activeTakeIndex' in chunk;
}

export const getTakeGroupLength: (
  takeGroup: TakeGroup,
  transcriptionWords: Word[]
) => number = (takeGroup, transcriptionWords) =>
  transcriptionWords.filter(
    (word) => word.takeInfo?.takeGroupId === takeGroup.id
  ).length;

export const generateTranscriptionChunks = (
  words: Word[],
  takeGroups: TakeGroup[]
) => {
  let numTakeGroups = 0;

  const chunks: TranscriptionChunk[] = words.reduce((chunksSoFar, word) => {
    const { takeInfo } = word;

    if (takeInfo === null) {
      return [...chunksSoFar, word];
    }

    if (chunksSoFar.length === 0) {
      numTakeGroups += 1;

      return [
        {
          id: 0,
          activeTakeIndex:
            takeGroups.find((takeGroup) => takeGroup.id === 0)
              ?.activeTakeIndex ?? 0,
        },
      ];
    }

    const numChunks = chunksSoFar.length;
    const lastChunk = chunksSoFar[numChunks - 1];

    if (isTakeGroup(lastChunk) && takeInfo.takeGroupId === lastChunk.id) {
      return chunksSoFar;
    }

    const newChunks = chunksSoFar.concat({
      id: numTakeGroups,
      activeTakeIndex:
        takeGroups.find((takeGroup) => takeGroup.id === numTakeGroups)
          ?.activeTakeIndex ?? 0,
    });

    numTakeGroups += 1;

    return newChunks;
  }, [] as TranscriptionChunk[]);

  return chunks;
};
