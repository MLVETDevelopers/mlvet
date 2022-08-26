import { TakeGroup, TakeInfo, Word, Take } from 'sharedTypes';

interface ChunksData {
  chunks: (TakeGroup | Word | never)[];
  currentTakeInfo: TakeInfo | null;
}

const createTake = (...words: Word[]): Take => {
  return { words };
};

const addWordToTake = (take: Take, word: Word): Take => {
  return {
    ...take,
    words: [...take.words, word],
  };
};

const addWordToTakeGroup = (takeGroup: TakeGroup, word: Word): TakeGroup => {
  const otherTakes = takeGroup?.takes ? takeGroup.takes.slice(0, -1) : [];
  const take = takeGroup?.takes ? (takeGroup.takes[-1] as Take) : createTake();
  return { ...takeGroup, takes: [...otherTakes, addWordToTake(take, word)] };
};

const addWordWithNewTake = (chunksData: ChunksData, word: Word): ChunksData => {
  const otherChunks = chunksData.chunks.slice(0, -1);
  const takeGroup = chunksData.chunks[-1] as TakeGroup;
  return {
    ...chunksData,
    chunks: [
      ...otherChunks,
      { ...takeGroup, takes: [...(takeGroup?.takes ?? []), createTake(word)] },
    ],
  };
};

const addWordWithNewTakeGroup = (
  chunksData: ChunksData,
  word: Word,
  takeGroupBase: TakeGroup
): ChunksData => {
  return {
    ...chunksData,
    chunks: [...chunksData.chunks, addWordToTakeGroup(takeGroupBase, word)],
  };
};

const addWordToCurrentTakeGroup = (
  chunksData: ChunksData,
  word: Word
): ChunksData => {
  const otherChunks = chunksData.chunks.slice(0, -1);
  const takeGroup = chunksData.chunks[-1] as TakeGroup;
  return {
    ...chunksData,
    chunks: [...otherChunks, addWordToTakeGroup(takeGroup, word)],
  };
};

const addWord = (chunksData: ChunksData, word: Word): ChunksData => ({
  ...chunksData,
  chunks: [...chunksData.chunks, word],
});

// eslint-disable-next-line import/prefer-default-export
export const generateTranscriptionChunks = (
  words: Word[],
  takeGroups: TakeGroup[]
) => {
  const chunksDataInit: ChunksData = {
    chunks: [],
    currentTakeInfo: null,
  };

  return words.reduce((chunksData, word: Word) => {
    const wordTakeInfo = word.takeInfo;
    if (wordTakeInfo) {
      const { takeGroupId, takeIndex } = wordTakeInfo;

      // Create new take group if no current take group or word is part of different take group
      if (
        chunksData.currentTakeInfo === null ||
        takeGroupId !== chunksData.currentTakeInfo?.takeGroupId
      ) {
        const takeGroupBase = takeGroups.find(
          (takeGroup) => takeGroup.id === takeGroupId
        ) as TakeGroup;
        return addWordWithNewTakeGroup(chunksData, word, takeGroupBase);
      }

      // Create new take if word is part of different take
      if (
        chunksData.currentTakeInfo !== null &&
        takeIndex !== chunksData.currentTakeInfo?.takeIndex
      )
        return addWordWithNewTake(chunksData, word);

      // Add word to current take
      return addWordToCurrentTakeGroup(chunksData, word);
    }

    // Return word outside of take group
    return addWord(chunksData, word);
  }, chunksDataInit).chunks;
};
