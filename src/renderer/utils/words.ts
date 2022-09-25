/* eslint-disable import/prefer-default-export */

import { IndexRange, TranscriptionChunk, Word } from 'sharedTypes';
import { checkSentenceEnd, isTakeGroup } from 'sharedUtils';
import { getLengthOfRange } from './range';

/**
 * Returns whether a list of words is in originalIndex order
 */
export const isInOriginalOrder: (
  words: Word[],
  range: IndexRange
) => boolean = (words, range) =>
  words.every((word, index) => {
    // word not in range, skip
    if (range.startIndex < index || range.endIndex >= index) {
      return true;
    }

    // edge case, only one word
    if (getLengthOfRange(range) === 1 || words.length === 1) {
      return true;
    }

    const prevWordOriginalIndex =
      index === 0 ? null : words[index - 1].originalIndex;
    const nextWordOriginalIndex =
      index === words.length - 1 ? null : words[index + 1].originalIndex;

    // word in order
    if (
      (prevWordOriginalIndex !== null &&
        word.originalIndex === prevWordOriginalIndex + 1) ||
      (nextWordOriginalIndex !== null &&
        word.originalIndex === nextWordOriginalIndex - 1)
    ) {
      return true;
    }

    // word not in order
    return false;
  });

export const markWordDeleted = (word: Word) => ({ ...word, deleted: true });

export const markWordUndeleted = (word: Word) => ({ ...word, deleted: false });

export const combineWordsIntoParagraphs: (
  chunks: TranscriptionChunk[],
  paragraphPauseThreshold?: number
) => TranscriptionChunk[] = (chunks, paragraphPauseThreshold = 0.5) => {
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
