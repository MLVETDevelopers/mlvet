import { Word } from 'sharedTypes';

export interface DeleteWordsPayload {
  startIndex: number;
  endIndex: number;
}

export interface PasteWordsPayload {
  startIndex: number;
  clipboard: Word[];
}

export type UndoDeleteWordsPayload = DeleteWordsPayload;

export interface UndoPasteWordsPayload {
  startIndex: number;
  clipboardLength: number;
}

export type DoPayload = DeleteWordsPayload | PasteWordsPayload;

export type UndoPayload = UndoDeleteWordsPayload | UndoPasteWordsPayload;
