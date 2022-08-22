import { rangeLengthOne } from 'renderer/utils/range';
import { IndexRange, Word } from '../../../sharedTypes';
import { selectionCleared, selectionRangeAdded } from '../selection/actions';
import {
  selectionDeleted,
  undoSelectionDeleted,
  undoWordPasted,
  wordPasted,
  wordCorrected,
  wordSplit,
  wordsMerged,
  undoWordCorrected,
  undoWordSplit,
  undoWordsMerged,
} from './actions';
import { Op } from '../undoStack/helpers';
import {
  CorrectWordPayload,
  DeleteSelectionPayload,
  MergeWordsPayload,
  PasteWordsPayload,
  SplitWordPayload,
  UndoCorrectWordPayload,
  UndoDeleteSelectionPayload,
  UndoMergeWordsPayload,
  UndoPasteWordsPayload,
  UndoSplitWordPayload,
} from './opPayloads';

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
  clipboard: Word[]
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
  words: Word[],
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
  words: Word[],
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
export const makeSplitWord: (words: Word[], index: number) => SplitWordOp = (
  words,
  index
) => {
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

export const makeCorrectWord: (
  words: Word[],
  index: number,
  newText: string
) => CorrectWordOp = (words, index, newText) => {
  const prevText = words[index].word;

  return {
    do: [
      wordCorrected(index, newText),
      selectionCleared(),
      selectionRangeAdded(rangeLengthOne(index)),
    ],
    undo: [
      undoWordCorrected(index, prevText),
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

export type CorrectWordOp = Op<CorrectWordPayload, UndoCorrectWordPayload>;

export type MergeWordsOp = Op<MergeWordsPayload, UndoMergeWordsPayload>;

export type SplitWordOp = Op<SplitWordPayload, UndoSplitWordPayload>;
