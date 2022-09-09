import { IndexRange, Word } from '../../../../sharedTypes';
import { selectionCleared, selectionRangeAdded } from '../../selection/actions';
import {
  selectionDeleted,
  undoSelectionDeleted,
  undoWordPasted,
  wordPasted,
} from '../actions';
import { Op } from '../../undoStack/helpers';
import {
  DeleteSelectionPayload,
  PasteWordsPayload,
  UndoDeleteSelectionPayload,
  UndoPasteWordsPayload,
} from '../opPayloads';

export type MoveWordsOp = Op<
  DeleteSelectionPayload | PasteWordsPayload,
  UndoDeleteSelectionPayload | UndoPasteWordsPayload
>;

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
      ...fromRanges.map((range) => selectionRangeAdded(range)),
    ],
  };
};
