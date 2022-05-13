import { Word } from '../../sharedTypes';

export type DeleteEverySecondWordPayload = null;

export type UndoDeleteEverySecondWordPayload = {
  deletedWords: Word[];
};

export interface ChangeWordToSwampPayload {
  index: number;
}

export interface UndoChangeWordToSwampPayload {
  index: number;
  changedWord: Word;
}

export interface DeleteWordsPayload {
  startIndex: number;
  endIndex: number;
}

export type UndoDeleteWordsPayload = DeleteWordsPayload;

export type DoPayload =
  | DeleteEverySecondWordPayload
  | ChangeWordToSwampPayload
  | DeleteWordsPayload;

export type UndoPayload =
  | UndoDeleteEverySecondWordPayload
  | UndoChangeWordToSwampPayload
  | UndoDeleteWordsPayload;
