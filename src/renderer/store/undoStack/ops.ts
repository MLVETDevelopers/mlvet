import { IndexRange, Word } from '../../../sharedTypes';
import { selectionCleared, selectionRangeAdded } from '../selection/actions';
import {
  selectionDeleted,
  undoSelectionDeleted,
  undoWordPasted,
  wordPasted,
} from '../transcription/actions';
import { Op } from './helpers';
import {
  PasteWordsPayload,
  UndoPasteWordsPayload,
  DeleteSelectionPayload,
  UndoDeleteSelectionPayload,
  MergeWordsPayload,
  UndoMergeWordsPayload,
  UndoSplitWordPayload,
  SplitWordPayload,
} from './opPayloads';

// More info on the undo stack: https://docs.google.com/document/d/1fBLBj_I3Y4AgRnIHzJ-grsXvzoKUBA03KNRv3DzABAg/edit

export const DELETE_SELECTION = 'DELETE_SELECTION';
export const UNDO_DELETE_SELECTION = 'UNDO_DELETE_SELECTION';

export const PASTE_WORD = 'PASTE_WORD';
export const UNDO_PASTE_WORD = 'UNDO_PASTE_WORD';

export const MERGE_WORDS = 'MERGE_WORDS';
export const UNDO_MERGE_WORDS = 'UNDO_MERGE_WORDS';

export const SPLIT_WORD = 'SPLIT_WORD';
export const UNDO_SPLIT_WORD = 'UNDO_SPLIT_WORD';

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
      {
        type: MERGE_WORDS,
        payload: { range },
      },
    ],
    undo: [
      {
        type: UNDO_MERGE_WORDS,
        payload: { index: range.startIndex, originalWords },
      },
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
    do: [
      {
        type: SPLIT_WORD,
        payload: { index } as SplitWordPayload,
      },
    ],
    undo: [
      {
        type: UNDO_SPLIT_WORD,
        payload: { range } as UndoSplitWordPayload,
      },
    ],
  };
};

export type DeleteSelectionOp = Op<
  DeleteSelectionPayload | null,
  UndoDeleteSelectionPayload | null | IndexRange
>;

export type PasteWordsOp = Op<
  PasteWordsPayload | null | IndexRange,
  UndoPasteWordsPayload | null
>;

export type MoveWordsOp = Op<
  DeleteSelectionPayload | PasteWordsPayload | IndexRange | null,
  UndoDeleteSelectionPayload | UndoPasteWordsPayload | IndexRange | null
>;

export type PasteWordsOp = Op<PasteWordsPayload, UndoPasteWordsPayload>;

export type MergeWordsOp = Op<MergeWordsPayload, UndoMergeWordsPayload>;

export type SplitWordOp = Op<SplitWordPayload, UndoSplitWordPayload>;
