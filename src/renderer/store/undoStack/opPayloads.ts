export interface DeleteWordsPayload {
  startIndex: number;
  endIndex: number;
}

export interface PasteWordsPayload {
  toIndex: number;
  startIndex: number;
  endIndex: number;
}

export type UndoDeleteWordsPayload = DeleteWordsPayload;

export type UndoPasteWordsPayload = PasteWordsPayload;

export type DoPayload = DeleteWordsPayload;

export type UndoPayload = UndoDeleteWordsPayload;
