import { Reducer } from 'react';
import { mapInRanges } from 'renderer/utils/list';
import { Word } from 'sharedTypes';
import { Action } from '../action';
import {
  DELETE_SELECTION,
  PASTE_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_PASTE_WORD,
} from './actions';
import {
  DeleteSelectionPayload,
  PasteWordsPayload,
  UndoDeleteSelectionPayload,
  UndoPasteWordsPayload,
} from './opPayloads';

/**
 *  Nested reducer for handling transcription words
 */
const transcriptionWordsReducer: Reducer<Word[], Action<any>> = (
  words = [],
  action
) => {
  if (action.type === DELETE_SELECTION) {
    const { ranges } = action.payload as DeleteSelectionPayload;

    const markDeleted = (word: Word) => ({ ...word, deleted: true });

    const newWords = mapInRanges(words, markDeleted, ranges);

    return newWords;
  }

  if (action.type === UNDO_DELETE_SELECTION) {
    const { ranges } = action.payload as UndoDeleteSelectionPayload;

    const markUndeleted = (word: Word) => ({ ...word, deleted: false });

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

  return words;
};

export default transcriptionWordsReducer;
