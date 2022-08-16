import { Reducer } from 'redux';
import { mapInRanges } from 'renderer/util';
import { updateOutputStartTimes } from 'transcriptProcessing/updateOutputStartTimes';
import {
  TRANSCRIPTION_CREATED,
  DELETE_SELECTION,
  PASTE_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_PASTE_WORD,
  MERGE_WORDS,
  UNDO_SPLIT_WORD,
  UNDO_MERGE_WORDS,
  SPLIT_WORD,
} from './actions';
import { Transcription, Word } from '../../../sharedTypes';
import { Action } from '../action';
import {
  DeleteSelectionPayload,
  MergeWordsPayload,
  PasteWordsPayload,
  SplitWordPayload,
  UndoDeleteSelectionPayload,
  UndoMergeWordsPayload,
  UndoPasteWordsPayload,
} from '../undoStack/opPayloads';
import { mergeWords } from './mergeWords';
import { splitWord } from './splitWord';

/**
 *  Nested reducer for handling transcriptions
 */
const transcriptionReducer: Reducer<Transcription | null, Action<any>> = (
  transcription = null,
  action
) => {
  if (action.type === TRANSCRIPTION_CREATED) {
    return action.payload as Transcription;
  }

  // Everything below here assumes we have a transcription, so early exit if we don't
  if (transcription === null) {
    return null;
  }

  /**
   * Important: if you make an update to the transcription here, usually you
   * will need to call 'updateOutputStartTimes' so that output start times are kept accurate!
   */

  if (action.type === DELETE_SELECTION) {
    const { ranges } = action.payload as DeleteSelectionPayload;

    const markDeleted = (word: Word) => ({ ...word, deleted: true });

    const newWords = mapInRanges(transcription.words, markDeleted, ranges);

    return {
      ...transcription,
      words: updateOutputStartTimes(newWords),
    };
  }

  if (action.type === UNDO_DELETE_SELECTION) {
    const { ranges } = action.payload as UndoDeleteSelectionPayload;

    const markUndeleted = (word: Word) => ({ ...word, deleted: false });

    return {
      ...transcription,
      words: updateOutputStartTimes(
        mapInRanges(transcription.words, markUndeleted, ranges)
      ),
    };
  }

  if (action.type === PASTE_WORD) {
    const { startIndex, clipboard } = action.payload as PasteWordsPayload;

    const prefix = transcription.words.slice(0, startIndex + 1);

    // Paste key must be unique for all pasted words - that is, no two pasted words should ever have the same paste key.
    // We force this invariant by finding the highest paste key in the entire transcription to this point, and then
    // adding n to it for the nth pasted word, for all words on the clipboard.
    const highestExistingPasteKey = Math.max(
      0,
      ...transcription.words.map((word) => word.pasteKey)
    );
    const wordsToPaste = clipboard.map((word, index) => ({
      ...word,
      pasteKey: highestExistingPasteKey + index + 1,
    }));

    const suffix = transcription.words.slice(startIndex + 1);

    return {
      ...transcription,
      words: updateOutputStartTimes([...prefix, ...wordsToPaste, ...suffix]),
    };
  }

  if (action.type === UNDO_PASTE_WORD) {
    const { startIndex, clipboardLength } =
      action.payload as UndoPasteWordsPayload;

    const prefix = transcription.words.slice(0, startIndex + 1);
    const suffix = transcription.words.slice(startIndex + clipboardLength + 1);

    return {
      ...transcription,
      words: updateOutputStartTimes([...prefix, ...suffix]),
    };
  }

  // Doing a MERGE_WORDS action is identical to undoing a SPLIT_WORD action
  if (action.type === MERGE_WORDS || action.type === UNDO_SPLIT_WORD) {
    const { range } = action.payload as MergeWordsPayload;
    const { words } = transcription;

    const mergedWords = mergeWords(words, range);

    return {
      ...transcription,
      words: updateOutputStartTimes(mergedWords),
    };
  }

  if (action.type === UNDO_MERGE_WORDS) {
    const { index, originalWords } = action.payload as UndoMergeWordsPayload;
    const { words } = transcription;

    const count = originalWords.length;

    const prefix = words.slice(0, index);
    const suffix = words.slice(index + count);

    return {
      ...transcription,
      words: [...prefix, ...originalWords, ...suffix],
    };
  }

  if (action.type === SPLIT_WORD) {
    const { index } = action.payload as SplitWordPayload;
    const { words } = transcription;

    const splitWords = splitWord(words, index);

    return {
      ...transcription,
      words: updateOutputStartTimes(splitWords),
    };
  }

  return transcription;
};

export default transcriptionReducer;
