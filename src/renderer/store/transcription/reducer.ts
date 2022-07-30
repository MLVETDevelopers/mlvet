import { Reducer } from 'redux';
import { mapInRange } from 'renderer/util';
import { updateOutputStartTimes } from 'transcriptProcessing/updateOutputStartTimes';
import { TRANSCRIPTION_CREATED } from './actions';
import { Transcription, Word } from '../../../sharedTypes';
import { Action } from '../action';
import {
  DeleteWordsPayload,
  PasteWordsPayload,
  UndoDeleteWordsPayload,
  UndoPasteWordsPayload,
} from '../undoStack/opPayloads';
import {
  DELETE_WORD,
  UNDO_DELETE_WORD,
  PASTE_WORD,
  UNDO_PASTE_WORD,
} from '../undoStack/ops';

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

  if (action.type === DELETE_WORD) {
    const { startIndex, endIndex } = action.payload as DeleteWordsPayload;

    const markDeleted = (word: Word) => ({ ...word, deleted: true });

    return {
      ...transcription,
      words: updateOutputStartTimes(
        mapInRange(transcription.words, markDeleted, startIndex, endIndex)
      ),
    };
  }

  if (action.type === UNDO_DELETE_WORD) {
    const { startIndex, endIndex } = action.payload as UndoDeleteWordsPayload;

    const markUndeleted = (word: Word) => ({ ...word, deleted: false });

    return {
      ...transcription,
      words: updateOutputStartTimes(
        mapInRange(transcription.words, markUndeleted, startIndex, endIndex)
      ),
    };
  }

  if (action.type === PASTE_WORD) {
    const { startIndex, clipboard } = action.payload as PasteWordsPayload;

    const prefix = transcription.words.slice(0, startIndex + 1);

    // This is currently O(n^2); consider caching as described in
    // https://docs.google.com/document/d/1lQPJ4-kCI72GhNjpNbguT2iT5ihD_6oBikop-gXziYQ/edit
    // if this gets slow.
    // Also, done iteratively rather than a map to support multiple words with
    // the same original index being pasted.
    const wordsToPaste: Word[] = [];

    clipboard.forEach((word) => {
      wordsToPaste.push({
        ...word,
        // Paste count must be unique each time the same word is pasted, so we just
        // look at the existing paste counts and use the highest existing one, + 1.
        // This includes looking at the wordsToPaste that is being built, since
        // it can include words with the same original index!
        pasteCount:
          Math.max(
            0,
            Math.max(
              ...[...transcription.words, ...wordsToPaste]
                .filter(
                  (innerWord) => innerWord.originalIndex === word.originalIndex
                )
                .map((innerWord) => innerWord.pasteCount)
            )
          ) + 1,
      });
    });

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

  return transcription;
};

export default transcriptionReducer;
