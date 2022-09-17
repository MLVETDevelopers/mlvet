import { Reducer } from 'react';
import { mapInRange } from 'sharedUtils';
import { Word } from 'sharedTypes';
import { rangeLengthOne } from 'renderer/utils/range';
import { markWordDeleted } from 'renderer/utils/words';
import { Action } from '../action';
import { mergeWords } from './helpers/mergeWordsHelper';
import { splitWord } from './helpers/splitWordHelper';
import {
  CORRECT_WORD,
  DELETE_SELECTION,
  MERGE_WORDS,
  PASTE_WORD,
  RESTORE_SECTION,
  SPLIT_WORD,
  UNDO_CORRECT_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_MERGE_WORDS,
  UNDO_PASTE_WORD,
  UNDO_SPLIT_WORD,
  UNDO_RESTORE_SECTION,
} from './actions';
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
} from './opPayloads';

/**
 *  Nested reducer for handling transcription words
 */
const transcriptionWordsReducer: Reducer<Word[], Action<any>> = (
  words = [],
  action
) => {
  if (action.type === DELETE_SELECTION) {
    const { range } = action.payload as DeleteSelectionPayload;

    return mapInRange(words, markWordDeleted, range);
  }

  if (action.type === UNDO_DELETE_SELECTION) {
    const { range } = action.payload as UndoDeleteSelectionPayload;

    const markUndeleted = (word: Word) => ({
      ...word,
      deleted: false,
    });

    return mapInRange(words, markUndeleted, range);
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

    return splitWord(words, index);
  }

  if (action.type === CORRECT_WORD) {
    const { index, text } = action.payload as CorrectWordPayload;

    return mapInRange(
      words,
      (word) => ({ ...word, word: text, confidence: 1 }),
      rangeLengthOne(index)
    );
  }

  if (action.type === UNDO_CORRECT_WORD) {
    const { index, prevText, prevConfidence } =
      action.payload as UndoCorrectWordPayload;

    return mapInRange(
      words,
      (word) => ({ ...word, word: prevText, prevConfidence }),
      rangeLengthOne(index)
    );
  }

  if (action.type === RESTORE_SECTION) {
    const { range } = action.payload as RestoreSectionPayload;

    const markUndeleted = (word: Word) => ({
      ...word,
      deleted: false,
    });

    return mapInRange(words, markUndeleted, range);
  }

  if (action.type === UNDO_RESTORE_SECTION) {
    const { range } = action.payload as UndoRestoreSectionPayload;

    return mapInRange(words, markWordDeleted, range);
  }

  return words;
};

export default transcriptionWordsReducer;
