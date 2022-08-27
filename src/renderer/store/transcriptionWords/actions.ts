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

export const DELETE_SELECTION = 'DELETE_SELECTION';
export const UNDO_DELETE_SELECTION = 'UNDO_DELETE_SELECTION';

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

export const sectionRestored: (
  ranges: IndexRange[]
) => Action<RestoreSectionPayload> = (ranges) => ({
  type: RESTORE_SECTION,
  payload: { ranges },
});

export const undoSectionRestored: (
  ranges: IndexRange[]
) => Action<UndoRestoreSectionPayload> = (ranges) => ({
  type: UNDO_RESTORE_SECTION,
  payload: { ranges },
});
