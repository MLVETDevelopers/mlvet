import { IndexRange, Word } from '../../../sharedTypes';

export interface DeleteSelectionPayload {
  ranges: IndexRange[];
}

export interface PasteWordsPayload {
  startIndex: number;
  clipboard: Word[];
}

export interface MoveWordsPayload {
  fromRanges: IndexRange[];
  toAfterIndex: number;
}

export type UndoDeleteSelectionPayload = DeleteSelectionPayload;

export interface UndoPasteWordsPayload {
  startIndex: number;
  clipboardLength: number;
}

export type UndoMoveWordsPayload = MoveWordsPayload;

export type DoPayload = DeleteSelectionPayload | PasteWordsPayload | MoveWordsPayload;

export type UndoPayload = UndoDeleteSelectionPayload | UndoPasteWordsPayload | UndoMoveWordsPayload;
