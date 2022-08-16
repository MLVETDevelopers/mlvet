import { IndexRange, Word } from '../../../sharedTypes';

export interface DeleteSelectionPayload {
  ranges: IndexRange[];
}

export interface PasteWordsPayload {
  startIndex: number;
  clipboard: Word[];
}

export interface MergeWordsPayload {
  range: IndexRange;
}

export interface SplitWordPayload {
  index: number;
}

export type UndoDeleteSelectionPayload = DeleteSelectionPayload;

export interface UndoPasteWordsPayload {
  startIndex: number;
  clipboardLength: number;
}

export interface UndoMergeWordsPayload {
  index: number;
  originalWords: Word[];
}

export type UndoSplitWordPayload = MergeWordsPayload;

export type DoPayload =
  | DeleteSelectionPayload
  | PasteWordsPayload
  | MergeWordsPayload
  | SplitWordPayload
  | IndexRange
  | null;

export type UndoPayload =
  | UndoDeleteSelectionPayload
  | UndoPasteWordsPayload
  | UndoMergeWordsPayload
  | UndoSplitWordPayload
  | IndexRange
  | null;
