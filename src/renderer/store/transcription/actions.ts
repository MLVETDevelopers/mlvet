import { IndexRange, Transcription, Word } from '../../../sharedTypes';
import { Action } from '../action';
import {
  DeleteSelectionPayload,
  MergeWordsPayload,
  PasteWordsPayload,
  SplitWordPayload,
  UndoDeleteSelectionPayload,
  UndoMergeWordsPayload,
  UndoPasteWordsPayload,
  UndoSplitWordPayload,
} from '../undoStack/opPayloads';

export const TRANSCRIPTION_CREATED = 'TRANSCRIPTION_CREATED';

export const DELETE_SELECTION = 'DELETE_SELECTION';
export const UNDO_DELETE_SELECTION = 'UNDO_DELETE_SELECTION';

export const PASTE_WORD = 'PASTE_WORD';
export const UNDO_PASTE_WORD = 'UNDO_PASTE_WORD';

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

export const wordsMerged: (range: IndexRange) => Action<MergeWordsPayload> = (
  range
) => ({
  type: MERGE_WORDS,
  payload: { range },
});

export const undoWordsMerged: (
  index: number,
  originalWords: Word[]
) => Action<UndoMergeWordsPayload> = (index, originalWords) => ({
  type: UNDO_MERGE_WORDS,
  payload: { index, originalWords },
});

export const wordSplit: (index: number) => Action<SplitWordPayload> = (
  index
) => ({
  type: SPLIT_WORD,
  payload: { index },
});

export const undoWordSplit: (
  range: IndexRange
) => Action<UndoSplitWordPayload> = (range) => ({
  type: UNDO_SPLIT_WORD,
  payload: { range },
});
