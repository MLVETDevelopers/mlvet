import { IndexRange, Word } from '../../../sharedTypes';

export interface DeleteSelectionPayload {
  range: IndexRange;
}

export interface PasteWordsPayload {
  startIndex: number;
  clipboard: Word[];
}
export interface RestoreSectionPayload {
  range: IndexRange;
}

export type UndoDeleteSelectionPayload = DeleteSelectionPayload;

export interface UndoPasteWordsPayload {
  startIndex: number;
  clipboardLength: number;
}

export interface MergeWordsPayload {
  range: IndexRange;
}

export interface SplitWordPayload {
  index: number;
}

export interface UndoMergeWordsPayload {
  index: number;
  originalWords: Word[];
}

export type UndoSplitWordPayload = MergeWordsPayload;

export interface CorrectWordPayload {
  index: number;
  text: string;
}

export interface UndoCorrectWordPayload {
  index: number;
  prevText: string;
  prevConfidence: number;
}

export type UndoRestoreSectionPayload = RestoreSectionPayload;
