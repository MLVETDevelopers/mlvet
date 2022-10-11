import { Reducer } from 'react';
import { mapInRange, mapWithIndices } from 'sharedUtils';
import { Word } from 'sharedTypes';
import { getLengthOfRange, rangeLengthOne } from 'renderer/utils/range';
import { markWordDeleted, markWordUndeleted } from 'renderer/utils/words';
import { Action } from '../action';
import { mergeWords } from './helpers/mergeWordsHelper';
import { splitWord } from './helpers/splitWordHelper';
import {
  CORRECT_WORD,
  DELETE_WORDS,
  MERGE_WORDS,
  PASTE_WORD,
  RESTORE_SECTION,
  SPLIT_WORD,
  UNDO_CORRECT_WORD,
  UNDO_DELETE_WORDS,
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
import { getWordsTakeInfo } from './helpers/takeUtils';

/**
 *  Nested reducer for handling transcription words
 */
const transcriptionWordsReducer: Reducer<Word[], Action<any>> = (
  words = [],
  action
) => {
  if (action.type === DELETE_WORDS) {
    const { indices } = action.payload as DeleteSelectionPayload;

    return mapWithIndices(words, markWordDeleted, indices);
  }

  if (action.type === UNDO_DELETE_WORDS) {
    const { indices } = action.payload as UndoDeleteSelectionPayload;

    return mapWithIndices(words, markWordUndeleted, indices);
  }

  if (action.type === PASTE_WORD) {
    const { range, clipboard } = action.payload as PasteWordsPayload;
    const { startIndex, endIndex } = range;

    const prefix = words.slice(0, startIndex);

    const wordsToReplace = words.slice(startIndex, endIndex);
    const replacedWords =
      getLengthOfRange(range) > 1
        ? wordsToReplace.map(markWordDeleted)
        : wordsToReplace;

    // Paste key must be unique for all pasted words - that is, no two pasted words should ever have the same paste key.
    // We force this invariant by finding the highest paste key in the entire transcription to this point, and then
    // adding n to it for the nth pasted word, for all words on the clipboard.
    const highestExistingPasteKey = Math.max(
      0,
      ...words.map((word) => word.pasteKey)
    );
    let wordsToPaste = clipboard.map((word, index) => ({
      ...word,
      pasteKey: highestExistingPasteKey + index + 1,
    }));

    const suffix = words.slice(endIndex);

    // Replace takeInfo of pasted words with takeInfo of words from paste section
    const takeInfo = wordsToReplace.reduce(getWordsTakeInfo, null);
    wordsToPaste = wordsToPaste.map((word) => ({
      ...word,
      takeInfo,
    }));

    return [...prefix, ...replacedWords, ...wordsToPaste, ...suffix];
  }

  if (action.type === UNDO_PASTE_WORD) {
    const { range, clipboardLength } = action.payload as UndoPasteWordsPayload;
    const { startIndex, endIndex } = range;

    const prefix = words.slice(0, startIndex);
    const replacedWords = words
      .slice(startIndex, endIndex)
      .map(markWordUndeleted);
    const suffix = words.slice(endIndex + clipboardLength);

    return [...prefix, ...replacedWords, ...suffix];
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
