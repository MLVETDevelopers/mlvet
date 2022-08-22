import { rangeLengthOne } from 'renderer/utils/range';
import { IndexRange, WordComponent } from '../../../sharedTypes';
import { selectionCleared, selectionRangeAdded } from '../selection/actions';
import {
  selectionDeleted,
  undoSelectionDeleted,
  undoWordPasted,
  wordPasted,
  wordsMerged,
  undoWordsMerged,
  wordSplit,
  undoWordSplit,
} from '../transcriptionWords/actions';
import {
  DeleteSelectionPayload,
  MergeWordsPayload,
  PasteWordsPayload,
  SplitWordPayload,
  UndoDeleteSelectionPayload,
  UndoMergeWordsPayload,
  UndoPasteWordsPayload,
  UndoSplitWordPayload,
} from '../transcriptionWords/opPayloads';
import { Op } from './helpers';

// More info on the undo stack: https://docs.google.com/document/d/1fBLBj_I3Y4AgRnIHzJ-grsXvzoKUBA03KNRv3DzABAg/edit

export const makeDeleteSelection: (
  ranges: IndexRange[]
) => DeleteSelectionOp = (ranges) => ({
  do: [selectionDeleted(ranges), selectionCleared()],
  undo: [
    undoSelectionDeleted(ranges),
    selectionCleared(),
    ...ranges.map(selectionRangeAdded),
  ],
});

export const makePasteWord: (
  pasteTo: number,
  clipboard: WordComponent[]
) => PasteWordsOp = (pasteTo, clipboard) => {
  return {
    do: [
      wordPasted(pasteTo, clipboard),
      selectionCleared(),
      selectionRangeAdded({
        startIndex: pasteTo + 1,
        endIndex: pasteTo + clipboard.length + 1,
      }),
    ],
    undo: [undoWordPasted(pasteTo, clipboard.length), selectionCleared()],
  };
};

export const makeMoveWords: (
  words: WordComponent[],
  fromRanges: IndexRange[],
  toAfterIndex: number
) => MoveWordsOp = (words, fromRanges, toAfterIndex) => {
  const clipboard = fromRanges.flatMap((range) =>
    words.slice(range.startIndex, range.endIndex)
  );

  return {
    do: [
      selectionDeleted(fromRanges),
      wordPasted(toAfterIndex, clipboard),
      selectionCleared(),
      selectionRangeAdded({
        startIndex: toAfterIndex + 1,
        endIndex: toAfterIndex + clipboard.length + 1,
      }),
    ],
    undo: [
      undoWordPasted(toAfterIndex, clipboard.length),
      undoSelectionDeleted(fromRanges),
      selectionCleared(),
      ...fromRanges.map(selectionRangeAdded),
    ],
  };
};

/**
 * Merges a contiguous range of words into a single word, absorbing any buffers between
 * into the duration
 * @param words - current words in the transcription
 * @param range - range of words to merge into a single word
 * @returns op containing do and undo for a merge operation
 */
export const makeMergeWords: (
  words: WordComponent[],
  range: IndexRange
) => MergeWordsOp = (words, range) => {
  const originalWords = words.slice(range.startIndex, range.endIndex);

  return {
    do: [
      wordsMerged(range),
      selectionCleared(),
      selectionRangeAdded(rangeLengthOne(range.startIndex)),
    ],
    undo: [
      undoWordsMerged(range.startIndex, originalWords),
      selectionCleared(),
      selectionRangeAdded(range),
    ],
  };
};

/**
 * Splits a word that contains multiple words in its text, creating new words with evenly split durations.
 * @param words - current words in the transcription
 * @param index - index of word to split into multiple words
 * @returns op containing do and undo for a merge operation
 */
export const makeSplitWord: (
  words: WordComponent[],
  index: number
) => SplitWordOp = (words, index) => {
  const word = words[index];

  // Number of words that the word will be split into
  const wordCount = word.word.split(' ').length;

  const range = {
    startIndex: index,
    endIndex: index + wordCount,
  };

  return {
    do: [wordSplit(index), selectionCleared(), selectionRangeAdded(range)],
    undo: [
      undoWordSplit(range),
      selectionCleared(),
      selectionRangeAdded(rangeLengthOne(index)),
    ],
  };
};

export type DeleteSelectionOp = Op<
  DeleteSelectionPayload,
  UndoDeleteSelectionPayload
>;

export type PasteWordsOp = Op<PasteWordsPayload, UndoPasteWordsPayload>;

export type MoveWordsOp = Op<
  DeleteSelectionPayload | PasteWordsPayload,
  UndoDeleteSelectionPayload | UndoPasteWordsPayload
>;

export type MergeWordsOp = Op<MergeWordsPayload, UndoMergeWordsPayload>;

export type SplitWordOp = Op<SplitWordPayload, UndoSplitWordPayload>;
