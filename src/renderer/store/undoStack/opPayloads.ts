import { Word } from '../../../sharedTypes';

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

export type DoPayload = DeleteEverySecondWordPayload | ChangeWordToSwampPayload;

export type UndoPayload =
  | UndoDeleteEverySecondWordPayload
  | UndoChangeWordToSwampPayload;
