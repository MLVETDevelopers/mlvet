import { Reducer } from 'react';
import { mapInRanges } from 'renderer/utils/list';
import { WordComponent } from 'sharedTypes';
import { Action } from '../action';
import { mergeWords } from './mergeWords';
import { splitWord } from './splitWord';
import {
  DELETE_SELECTION,
  MERGE_WORDS,
  PASTE_WORD,
  SPLIT_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_MERGE_WORDS,
  UNDO_PASTE_WORD,
  UNDO_SPLIT_WORD,
} from './actions';
import {
  DeleteSelectionPayload,
  MergeWordsPayload,
  PasteWordsPayload,
  SplitWordPayload,
  UndoDeleteSelectionPayload,
  UndoMergeWordsPayload,
  UndoPasteWordsPayload,
} from './opPayloads';

/**
 *  Nested reducer for handling transcription words
 */
const transcriptionWordsReducer: Reducer<WordComponent[], Action<any>> = (
  words = [],
  action
) => {
  if (action.type === DELETE_SELECTION) {
    const { ranges } = action.payload as DeleteSelectionPayload;

    const markDeleted = (word: WordComponent) => ({ ...word, deleted: true });

    return mapInRanges(words, markDeleted, ranges);
  }

  if (action.type === UNDO_DELETE_SELECTION) {
    const { ranges } = action.payload as UndoDeleteSelectionPayload;

    const markUndeleted = (word: WordComponent) => ({
      ...word,
      deleted: false,
    });

    return mapInRanges(words, markUndeleted, ranges);
  }

  if (action.type === PASTE_WORD) {
    const { startIndex, clipboard } = action.payload as PasteWordsPayload;

    const prefix = words.slice(0, startIndex + 1);

    // Paste key must be unique for all pasted words - that is, no two pasted words should ever have the same paste key.
    // We force this invariant by finding the highest paste key in the entire transcription to this point, and then
    // adding n to it for the nth pasted word, for all words on the clipboard.
    const highestExistingPasteKey = Math.max(
      0,
      ...words.map((word) => word.pasteKey)
    );
    const wordsToPaste = clipboard.map((word, index) => ({
      ...word,
      pasteKey: highestExistingPasteKey + index + 1,
    }));

    const suffix = words.slice(startIndex + 1);

    return [...prefix, ...wordsToPaste, ...suffix];
  }

  if (action.type === UNDO_PASTE_WORD) {
    const { startIndex, clipboardLength } =
      action.payload as UndoPasteWordsPayload;

    const prefix = words.slice(0, startIndex + 1);
    const suffix = words.slice(startIndex + clipboardLength + 1);

    return [...prefix, ...suffix];
  }

  // Doing a MERGE_WORDS action is identical to undoing a SPLIT_WORD action
  if (action.type === MERGE_WORDS || action.type === UNDO_SPLIT_WORD) {
    const { range } = action.payload as MergeWordsPayload;

    return mergeWords(words, range);
  }

  if (action.type === UNDO_MERGE_WORDS) {
    const { index, originalWords } = action.payload as UndoMergeWordsPayload;

    const count = originalWords.length;

    const prefix = words.slice(0, index);
    const suffix = words.slice(index + count);

    return [...prefix, ...originalWords, ...suffix];
  }

  if (action.type === SPLIT_WORD) {
    const { index } = action.payload as SplitWordPayload;

    const split = splitWord(words, index);

    return split;
  }

  return words;
};

export default transcriptionWordsReducer;
