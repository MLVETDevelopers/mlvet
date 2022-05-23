import { Op } from './helpers';
import {
  DeleteWordsPayload,
  UndoDeleteWordsPayload,
  PasteWordsPayload,
  UndoPasteWordsPayload,
} from './opPayloads';

// More info on the undo stack: https://docs.google.com/document/d/1fBLBj_I3Y4AgRnIHzJ-grsXvzoKUBA03KNRv3DzABAg/edit

// These ops are just examples on how to use the op system.
// Obviously, replace them with the actual ops you want to use - for example, deleting words, moving words, etc.
export const DELETE_WORD = 'DELETE_WORD';
export const UNDO_DELETE_WORD = 'UNDO_DELETE_WORD';

export const PASTE_WORD = 'PASTE_WORD';
export const UNDO_PASTE_WORD = 'UNDO_PASTE_WORD';

export const makeDeleteWord: (
  deleteFrom: number,
  deleteTo: number
) => DeleteWordsOp = (deleteFrom, deleteTo) => ({
  do: {
    type: DELETE_WORD,
    payload: { startIndex: deleteFrom, endIndex: deleteTo },
  },
  undo: {
    type: UNDO_DELETE_WORD,
    payload: { startIndex: deleteFrom, endIndex: deleteTo },
  },
});

export const makePasteWord: (
  pasteTo: number,
  pasteStart: number,
  pasteEnd: number
) => PasteWordsOp = (pasteTo, pasteStart, pasteEnd) => {
  return {
    do: {
      type: PASTE_WORD,
      payload: { toIndex: pasteTo, startIndex: pasteStart, endIndex: pasteEnd },
    },
    undo: {
      type: UNDO_PASTE_WORD,
      payload: { toIndex: pasteTo, startIndex: pasteStart, endIndex: pasteEnd },
    },
  };
};

export type DeleteWordsOp = Op<DeleteWordsPayload, UndoDeleteWordsPayload>;
export type PasteWordsOp = Op<PasteWordsPayload, UndoPasteWordsPayload>;
