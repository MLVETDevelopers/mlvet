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
  let takeGroupNum = 0;
  const chunks: TranscriptionChunk[] = words.reduce((chunksSoFar, word) => {
    const { takeInfo } = word;

    if (takeInfo === null) {
      return [...chunksSoFar, word];
    }

    if (takeInfo.takeGroupId >= takeGroupNum) {
      takeGroupNum = takeInfo.takeGroupId + 1;
      return [
        ...chunksSoFar,
        {
          id: takeInfo.takeGroupId,
          activeTakeIndex:
            takeGroups.find(
              (takeGroup) => takeGroup.id === takeInfo.takeGroupId
            )?.activeTakeIndex ?? 0,
          takeSelected:
            takeGroups.find(
              (takeGroup) => takeGroup.id === takeInfo.takeGroupId
            )?.takeSelected ?? false,
        },
      ];
    }
    return chunksSoFar;
  }, [] as TranscriptionChunk[]);

  return chunks;
};
