import { rangeLengthOne } from 'renderer/util';
import { IndexRange, Word } from '../../../sharedTypes';
import { selectionCleared, selectionRangeAdded } from '../selection/actions';
import {
  selectionDeleted,
  undoSelectionDeleted,
  undoWordPasted,
  wordCorrected,
  undoWordCorrected,
  wordPasted,
} from '../transcription/actions';
import { Op } from './helpers';
import {
  PasteWordsPayload,
  UndoPasteWordsPayload,
  DeleteSelectionPayload,
  UndoDeleteSelectionPayload,
  UndoCorrectWordPayload,
  CorrectWordPayload,
} from './opPayloads';

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

export type CorrectWordOp = Op<
  CorrectWordPayload | IndexRange | null,
  UndoCorrectWordPayload | IndexRange | null
>;
