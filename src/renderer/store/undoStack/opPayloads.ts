import { IndexRange, Word } from '../../../sharedTypes';

export interface DeleteSelectionPayload {
  ranges: IndexRange[];
}

export interface PasteWordsPayload {
  startIndex: number;
  clipboard: Word[];
}

export interface CorrectWordPayload {
  index: number;
  text: string;
}

export interface UndoCorrectWordPayload {
  index: number;
  prevText: string;
}

export type UndoDeleteSelectionPayload = DeleteSelectionPayload;

export interface UndoPasteWordsPayload {
  startIndex: number;
  clipboardLength: number;
}

export type DoPayload =
  | DeleteSelectionPayload
  | PasteWordsPayload
  | CorrectWordPayload
  | IndexRange
  | null;

export type UndoPayload =
  | UndoDeleteSelectionPayload
  | UndoPasteWordsPayload
  | UndoCorrectWordPayload
  | IndexRange
  | null;
