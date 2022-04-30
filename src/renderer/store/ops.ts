import { Transcription } from '../../sharedTypes';
import { Op } from './opHelpers';
import {
  DeleteEverySecondWordPayload,
  UndoDeleteEverySecondWordPayload,
  ChangeWordToSwampPayload,
  UndoChangeWordToSwampPayload,
} from './opPayloads';

export const DELETE_EVERY_SECOND_WORD = 'DELETE_EVERY_SECOND_WORD';
export const UNDO_DELETE_EVERY_SECOND_WORD = 'UNDO_DELETE_EVERY_SECOND_WORD';
export const CHANGE_WORD_TO_SWAMP = 'CHANGE_WORD_TO_SWAMP';
export const UNDO_CHANGE_WORD_TO_SWAMP = 'UNDO_CHANGE_WORD_TO_SWAMP';

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
