import { IndexRange, Word } from '../../../sharedTypes';
import { Action } from '../action';
import {
  DeleteSelectionPayload,
  PasteWordsPayload,
  UndoDeleteSelectionPayload,
  UndoPasteWordsPayload,
} from './opPayloads';

export const DELETE_SELECTION = 'DELETE_SELECTION';
export const UNDO_DELETE_SELECTION = 'UNDO_DELETE_SELECTION';

export const PASTE_WORD = 'PASTE_WORD';
export const UNDO_PASTE_WORD = 'UNDO_PASTE_WORD';

export const selectionDeleted: (
  ranges: IndexRange[]
) => Action<DeleteSelectionPayload> = (ranges) => ({
  type: DELETE_SELECTION,
  payload: { ranges },
});

export const undoSelectionDeleted: (
  ranges: IndexRange[]
) => Action<UndoDeleteSelectionPayload> = (ranges) => ({
  type: UNDO_DELETE_SELECTION,
  payload: { ranges },
});

export const wordPasted: (
  startIndex: number,
  clipboard: Word[]
) => Action<PasteWordsPayload> = (startIndex, clipboard) => ({
  type: PASTE_WORD,
  payload: { startIndex, clipboard },
});

export const undoWordPasted: (
  startIndex: number,
  clipboardLength: number
) => Action<UndoPasteWordsPayload> = (startIndex, clipboardLength) => ({
  type: UNDO_PASTE_WORD,
  payload: { startIndex, clipboardLength },
});
