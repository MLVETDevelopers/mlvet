import {
  CorrectWordPayload,
  DeleteSelectionPayload,
  MergeWordsPayload,
  PasteWordsPayload,
  SplitWordPayload,
  UndoCorrectWordPayload,
  UndoDeleteSelectionPayload,
  UndoMergeWordsPayload,
  UndoPasteWordsPayload,
  UndoSplitWordPayload,
} from '../transcriptionWords/opPayloads';

export type DoPayload =
  | DeleteSelectionPayload
  | PasteWordsPayload
  | CorrectWordPayload
  | MergeWordsPayload
  | SplitWordPayload;

export type UndoPayload =
  | UndoDeleteSelectionPayload
  | UndoPasteWordsPayload
  | UndoCorrectWordPayload
  | UndoMergeWordsPayload
  | UndoSplitWordPayload;

export type OpPayload = DoPayload | UndoPayload;
