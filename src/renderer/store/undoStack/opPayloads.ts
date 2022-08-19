import { IndexRange } from '../../../sharedTypes';
import {
  DeleteSelectionPayload,
  PasteWordsPayload,
  UndoDeleteSelectionPayload,
  UndoPasteWordsPayload,
} from '../transcriptionWords/opPayloads';

export type DoPayload =
  | DeleteSelectionPayload
  | PasteWordsPayload
  | IndexRange
  | null;

export type UndoPayload =
  | UndoDeleteSelectionPayload
  | UndoPasteWordsPayload
  | IndexRange
  | null;
