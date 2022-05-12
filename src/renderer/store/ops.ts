import { Transcription } from '../../sharedTypes';
import { Op } from './helpers';
import {
  DeleteEverySecondWordPayload,
  UndoDeleteEverySecondWordPayload,
  ChangeWordToSwampPayload,
  UndoChangeWordToSwampPayload,
  DeleteWordsPayload,
  UndoDelteWordsPayload,
} from './opPayloads';

// More info on the undo stack: https://docs.google.com/document/d/1fBLBj_I3Y4AgRnIHzJ-grsXvzoKUBA03KNRv3DzABAg/edit

// These ops are just examples on how to use the op system.
// Obviously, replace them with the actual ops you want to use - for example, deleting words, moving words, etc.

export const DELETE_EVERY_SECOND_WORD = 'DELETE_EVERY_SECOND_WORD';
export const UNDO_DELETE_EVERY_SECOND_WORD = 'UNDO_DELETE_EVERY_SECOND_WORD';

export const CHANGE_WORD_TO_SWAMP = 'CHANGE_WORD_TO_SWAMP';
export const UNDO_CHANGE_WORD_TO_SWAMP = 'UNDO_CHANGE_WORD_TO_SWAMP';

export const DELETE_WORD = 'DELETE_WORD';
export const UNDO_DELETE_WORD = 'UNDO_DELETE_WORD';

export const makeDeleteWord: (
  startIndex: number,
  endIndex: number
) => DeleteWordsOp = (startWordIndex, endWordIndex) => ({
  do: {
    type: DELETE_WORD,
    payload: { startIndex: startWordIndex, endIndex: endWordIndex },
  },
  undo: {
    type: UNDO_DELETE_WORD,
    payload: { startIndex: startWordIndex, endIndex: endWordIndex },
  },
});

export const makeDeleteEverySecondWordOp: (
  transcription: Transcription
) => DeleteEverySecondWordOp = (transcription) => ({
  do: {
    type: DELETE_EVERY_SECOND_WORD,
    payload: null,
  },
  undo: {
    type: UNDO_DELETE_EVERY_SECOND_WORD,
    payload: {
      deletedWords: transcription.words.filter((_, i) => i % 2 === 1),
    },
  },
});

export const makeChangeWordToSwampOp: (
  transcription: Transcription,
  wordIndex: number
) => ChangeWordToSwampOp = (transcription, wordIndex) => ({
  do: {
    type: CHANGE_WORD_TO_SWAMP,
    payload: { index: wordIndex },
  },
  undo: {
    type: UNDO_CHANGE_WORD_TO_SWAMP,
    payload: { index: wordIndex, changedWord: transcription.words[wordIndex] },
  },
});

export type DeleteEverySecondWordOp = Op<
  DeleteEverySecondWordPayload,
  UndoDeleteEverySecondWordPayload
>;

export type ChangeWordToSwampOp = Op<
  ChangeWordToSwampPayload,
  UndoChangeWordToSwampPayload
>;

export type DeleteWordsOp = Op<DeleteWordsPayload, UndoDelteWordsPayload>;
