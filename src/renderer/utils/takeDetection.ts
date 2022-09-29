import { TakeGroup, TranscriptionChunk, Word } from 'sharedTypes';
import { combineWordsIntoParagraphs } from './words';

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

  const getTakeGroup = (id: number) => {
    return takeGroups.find((takeGroup) => takeGroup.id === id);
  };

  const chunksWithIndividualWords: TranscriptionChunk[] = words.reduce(
    (chunksSoFar, word) => {
      const { takeInfo } = word;

      if (takeInfo === null) {
        return [...chunksSoFar, [word]];
      }

      if (takeInfo.takeGroupId >= takeGroupNum) {
        takeGroupNum = takeInfo.takeGroupId + 1;
        return [
          ...chunksSoFar,
          {
            id: takeInfo.takeGroupId,
            activeTakeIndex:
              getTakeGroup(takeInfo.takeGroupId)?.activeTakeIndex ?? 0,
            takeSelected:
              getTakeGroup(takeInfo.takeGroupId)?.takeSelected ?? false,
          },
        ];
      }

      return chunksSoFar;
    },
    [] as TranscriptionChunk[]
  );

  const chunks = combineWordsIntoParagraphs(chunksWithIndividualWords);

  return chunks;
};
