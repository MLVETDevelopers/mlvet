import { IndexRange, Word } from '../../../sharedTypes';
import { selectionCleared, selectionRangeAdded } from '../selection/actions';
import {
  selectionDeleted,
  undoSelectionDeleted,
  undoWordPasted,
  wordPasted,
} from './actions';
import { Op } from '../undoStack/helpers';
import {
  DeleteSelectionPayload,
  PasteWordsPayload,
  UndoDeleteSelectionPayload,
  UndoPasteWordsPayload,
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

export type DeleteSelectionOp = Op<
  DeleteSelectionPayload,
  UndoDeleteSelectionPayload
>;

export type PasteWordsOp = Op<PasteWordsPayload, UndoPasteWordsPayload>;

export type MoveWordsOp = Op<
  DeleteSelectionPayload | PasteWordsPayload,
  UndoDeleteSelectionPayload | UndoPasteWordsPayload
>;
