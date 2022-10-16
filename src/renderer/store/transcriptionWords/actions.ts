import { IndexRange, Word } from '../../../sharedTypes';
import { Action } from '../action';
import {
  CorrectWordPayload,
  DeleteSelectionPayload,
  MergeWordsPayload,
  PasteWordsPayload,
  RestoreSectionPayload,
  SplitWordPayload,
  UndoCorrectWordPayload,
  UndoDeleteSelectionPayload,
  UndoMergeWordsPayload,
  UndoPasteWordsPayload,
  UndoRestoreSectionPayload,
  UndoSplitWordPayload,
} from './opPayloads';

export const DELETE_WORDS = 'DELETE_WORDS';
export const UNDO_DELETE_WORDS = 'UNDO_DELETE_WORDS';

export const PASTE_WORD = 'PASTE_WORD';
export const UNDO_PASTE_WORD = 'UNDO_PASTE_WORD';

export const MERGE_WORDS = 'MERGE_WORDS';
export const UNDO_MERGE_WORDS = 'UNDO_MERGE_WORDS';

export const SPLIT_WORD = 'SPLIT_WORD';
export const UNDO_SPLIT_WORD = 'UNDO_SPLIT_WORD';

export const CORRECT_WORD = 'CORRECT_WORD';
export const UNDO_CORRECT_WORD = 'UNDO_CORRECT_WORD';

export const RESTORE_SECTION = 'RESTORE_SECTION';
export const UNDO_RESTORE_SECTION = 'UNDO_RESTORE_SECTION';

export const selectionDeleted: (
  indices: number[]
) => Action<DeleteSelectionPayload> = (indices) => ({
  type: DELETE_WORDS,
  payload: { indices },
});

export const undoSelectionDeleted: (
  indices: number[]
) => Action<UndoDeleteSelectionPayload> = (indices) => ({
  type: UNDO_DELETE_WORDS,
  payload: { indices },
});

export const wordPasted: (
  range: IndexRange,
  clipboard: Word[]
) => Action<PasteWordsPayload> = (range, clipboard) => ({
  type: PASTE_WORD,
  payload: { range, clipboard },
});

export const undoWordPasted: (
  range: IndexRange,
  clipboardLength: number
) => Action<UndoPasteWordsPayload> = (range, clipboardLength) => ({
  type: UNDO_PASTE_WORD,
  payload: { range, clipboardLength },
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

export const wordCorrected: (
  index: number,
  newText: string
) => Action<CorrectWordPayload> = (index, newText) => ({
  type: CORRECT_WORD,
  payload: { index, text: newText },
});

export const undoWordCorrected: (
  index: number,
  prevText: string,
  prevConfidence: number
) => Action<UndoCorrectWordPayload> = (index, prevText, prevConfidence) => ({
  type: UNDO_CORRECT_WORD,
  payload: { index, prevText, prevConfidence },
});

export const sectionRestored: (
  range: IndexRange
) => Action<RestoreSectionPayload> = (range) => ({
  type: RESTORE_SECTION,
  payload: { range },
});

export const undoSectionRestored: (
  range: IndexRange
) => Action<UndoRestoreSectionPayload> = (range) => ({
  type: UNDO_RESTORE_SECTION,
  payload: { range },
});
