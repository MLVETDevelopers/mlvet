import { Word } from 'sharedTypes';
import { Op } from './helpers';
import {
  DeleteWordsPayload,
  UndoDeleteWordsPayload,
  PasteWordsPayload,
  UndoPasteWordsPayload,
} from './opPayloads';

// More info on the undo stack: https://docs.google.com/document/d/1fBLBj_I3Y4AgRnIHzJ-grsXvzoKUBA03KNRv3DzABAg/edit

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

export type DeleteWordsOp = Op<DeleteWordsPayload, UndoDeleteWordsPayload>;
export type PasteWordsOp = Op<PasteWordsPayload, UndoPasteWordsPayload>;
