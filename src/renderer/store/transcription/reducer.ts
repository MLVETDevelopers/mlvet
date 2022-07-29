import { Reducer } from 'redux';
import liveProcessTranscript from 'renderer/liveProcess';
import { mapInRange } from 'renderer/util';
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

  // If you add a method that handles edits to the transcription -> processTranscript()

  if (action.type === DELETE_WORD) {
    const { startIndex, endIndex } = action.payload as DeleteWordsPayload;

    const markDeleted = (word: Word) => ({ ...word, deleted: true });

    const updatedTranscription = {
      ...transcription,
      words: mapInRange(transcription.words, markDeleted, startIndex, endIndex),
    };

    return liveProcessTranscript(updatedTranscription);
  }

  if (action.type === UNDO_DELETE_WORD) {
    const { startIndex, endIndex } = action.payload as UndoDeleteWordsPayload;

    const markUndeleted = (word: Word) => ({ ...word, deleted: false });

    const updatedTranscription = {
      ...transcription,
      words: mapInRange(
        transcription.words,
        markUndeleted,
        startIndex,
        endIndex
      ),
    };

    return liveProcessTranscript(updatedTranscription);
  }

  if (action.type === PASTE_WORD) {
    const { startIndex, clipboard } = action.payload as PasteWordsPayload;

    const prefix = transcription.words.slice(0, startIndex + 1);
    const suffix = transcription.words.slice(startIndex + 1);

    const updatedTranscription = {
      ...transcription,
      words: [...prefix, ...clipboard, ...suffix],
    };

    return liveProcessTranscript(updatedTranscription);
  }

  if (action.type === UNDO_PASTE_WORD) {
    const { startIndex, clipboardLength } =
      action.payload as UndoPasteWordsPayload;

    const prefix = transcription.words.slice(0, startIndex + 1);
    // The offset of 2 assumes a space, so if we change the way spaces are handled
    // this will probably break. Altogether I think spaces should be done at the rendering
    // level not at the transcription-processing level since they can be generated on
    // the fly and when they are part of the transcription they make it kind of harder to work with
    const suffix = transcription.words.slice(startIndex + clipboardLength + 2);

    console.log(prefix, suffix);

    const updatedTranscription = {
      ...transcription,
      words: [...prefix, ...suffix],
    };
    return liveProcessTranscript(updatedTranscription);
  }

  return transcription;
};

export default transcriptionReducer;
