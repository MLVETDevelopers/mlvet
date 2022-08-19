import { IndexRange, Word } from '../../../sharedTypes';

export interface DeleteSelectionPayload {
  ranges: IndexRange[];
}

export interface PasteWordsPayload {
  startIndex: number;
  clipboard: Word[];
}

export type UndoDeleteSelectionPayload = DeleteSelectionPayload;

export interface UndoPasteWordsPayload {
  startIndex: number;
  clipboardLength: number;
}
