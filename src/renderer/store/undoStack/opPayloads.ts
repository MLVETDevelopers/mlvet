import {
  DeleteSelectionPayload,
  MergeWordsPayload,
  PasteWordsPayload,
  SplitWordPayload,
  UndoDeleteSelectionPayload,
  UndoMergeWordsPayload,
  UndoPasteWordsPayload,
  UndoSplitWordPayload,
} from '../transcriptionWords/opPayloads';

export type DoPayload =
  | DeleteSelectionPayload
  | PasteWordsPayload
  | MergeWordsPayload
  | SplitWordPayload;

export type UndoPayload =
  | UndoDeleteSelectionPayload
  | UndoPasteWordsPayload
  | UndoMergeWordsPayload
  | UndoSplitWordPayload;
