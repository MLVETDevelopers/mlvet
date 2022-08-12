import { IndexRange, Transcription, Word } from '../../../sharedTypes';
import { Action } from '../action';
import {
  CorrectWordPayload,
  DeleteSelectionPayload,
  PasteWordsPayload,
  UndoCorrectWordPayload,
  UndoDeleteSelectionPayload,
  UndoPasteWordsPayload,
} from '../undoStack/opPayloads';

export const TRANSCRIPTION_CREATED = 'TRANSCRIPTION_CREATED';

export const DELETE_SELECTION = 'DELETE_SELECTION';
export const UNDO_DELETE_SELECTION = 'UNDO_DELETE_SELECTION';

export const PASTE_WORD = 'PASTE_WORD';
export const UNDO_PASTE_WORD = 'UNDO_PASTE_WORD';

export const CORRECT_WORD = 'CORRECT_WORD';
export const UNDO_CORRECT_WORD = 'UNDO_CORRECT_WORD';

export const transcriptionCreated: (
  transcription: Transcription
) => Action<Transcription> = (transcription) => ({
  type: TRANSCRIPTION_CREATED,
  payload: transcription,
});

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

export const wordCorrected: (
  index: number,
  newText: string
) => Action<CorrectWordPayload> = (index, newText) => ({
  type: CORRECT_WORD,
  payload: { index, text: newText },
});

export const undoWordCorrected: (
  index: number,
  prevText: string
) => Action<UndoCorrectWordPayload> = (index, prevText) => ({
  type: UNDO_CORRECT_WORD,
  payload: { index, prevText },
});
