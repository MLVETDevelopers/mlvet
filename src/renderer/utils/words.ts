/* eslint-disable import/prefer-default-export */

import { TranscriptionChunk, Word } from 'sharedTypes';
import { checkSentenceEnd, isTakeGroup } from 'sharedUtils';

export const markWordDeleted = (word: Word) => ({ ...word, deleted: true });

export const markWordUndeleted = (word: Word) => ({ ...word, deleted: false });

export const markWordFound = (word: Word) => ({
  ...word,
  ctrlFindState: {
    searchMatch: true,
    selected: false,
  },
});

export const markWordSelected = (word: Word) => ({ ...word, selected: true });
export const combineWordsIntoParagraphs: (
  chunks: TranscriptionChunk[],
  paragraphPauseThreshold?: number
) => TranscriptionChunk[] = (chunks, paragraphPauseThreshold = 4) => {
  // Words that haven't yet been added to a chunk
  let pendingWords: Word[] = [];

  return chunks.reduce<TranscriptionChunk[]>((chunksSoFar, chunk, index) => {
    const isLastWordInTranscription = index === chunks.length - 1;

    if (isTakeGroup(chunk)) {
      if (pendingWords.length > 0) {
        const newChunks = [...chunksSoFar, pendingWords, chunk];
        pendingWords = [];
        return newChunks;
      }
      return [...chunksSoFar, chunk];
    }

    const [word] = chunk as Word[];
    pendingWords.push(word);

    const isPrevWordSentenceEnd =
      index === 0 ||
      (!isTakeGroup(chunks[index - 1]) &&
        checkSentenceEnd((chunks[index - 1] as Word[])[0]));

    // Paragraph ends are marked by long pauses after the end of a sentence
    const isParagraphEnd =
      word.word === null &&
      word.duration >= paragraphPauseThreshold &&
      isPrevWordSentenceEnd;

    if (isParagraphEnd || isLastWordInTranscription) {
      const newChunks = [...chunksSoFar, pendingWords];

      // Reset the pending words list before returning
      pendingWords = [];

      return newChunks;
    }

    return chunksSoFar;
  }, []);
};
