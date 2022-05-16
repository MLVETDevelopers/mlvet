export interface DeleteWordsPayload {
  startIndex: number;
  endIndex: number;
}

export type UndoDeleteWordsPayload = DeleteWordsPayload;

export type DoPayload = DeleteWordsPayload;

export type UndoPayload = UndoDeleteWordsPayload;
