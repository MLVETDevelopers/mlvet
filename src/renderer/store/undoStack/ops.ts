import { IndexRange, Word } from '../../../sharedTypes';
import { Op } from './helpers';
import {
  PasteWordsPayload,
  UndoPasteWordsPayload,
  DeleteSelectionPayload,
  UndoDeleteSelectionPayload,
  MoveWordsPayload,
  UndoMoveWordsPayload,
} from './opPayloads';

// More info on the undo stack: https://docs.google.com/document/d/1fBLBj_I3Y4AgRnIHzJ-grsXvzoKUBA03KNRv3DzABAg/edit

export const DELETE_SELECTION = 'DELETE_SELECTION';
export const UNDO_DELETE_SELECTION = 'UNDO_DELETE_SELECTION';

export const PASTE_WORD = 'PASTE_WORD';
export const UNDO_PASTE_WORD = 'UNDO_PASTE_WORD';

export const MOVE_WORDS = 'MOVE_WORDS';
export const UNDO_MOVE_WORDS = 'UNDO_MOVE_WORDS';

export const makeDeleteSelection: (
  ranges: IndexRange[]
) => DeleteSelectionOp = (ranges) => ({
  do: {
    type: DELETE_SELECTION,
    payload: { ranges },
  },
  undo: {
    type: UNDO_DELETE_SELECTION,
    payload: { ranges },
  },
});

export const makePasteWord: (
  pasteTo: number,
  clipboard: Word[]
) => PasteWordsOp = (pasteTo, clipboard) => {
  return {
    do: {
      type: PASTE_WORD,
      payload: { startIndex: pasteTo, clipboard },
    },
    undo: {
      type: UNDO_PASTE_WORD,
      payload: { startIndex: pasteTo, clipboardLength: clipboard.length },
    },
  };
};

export const makeMoveWords: (
  fromRanges: IndexRange[],
  toAfterIndex: number,
) => MoveWordsOp = (fromRanges, toAfterIndex) => {
  return {
    do: {
      type: MOVE_WORDS,
      payload: { fromRanges, toAfterIndex },
    },
    undo: {
      type: UNDO_MOVE_WORDS,
      payload: { fromRanges, toAfterIndex },
    },
  };
};

export type DeleteSelectionOp = Op<
  DeleteSelectionPayload,
  UndoDeleteSelectionPayload
>;

export type PasteWordsOp = Op<PasteWordsPayload, UndoPasteWordsPayload>;

export type MoveWordsOp = Op<MoveWordsPayload, UndoMoveWordsPayload>;
