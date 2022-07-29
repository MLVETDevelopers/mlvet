import { Reducer } from 'redux';
import liveProcessTranscript from 'main/editDelete/liveProcess';
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

const processTranscript = (transcription: Transcription) => {
  // TODO(chloe): we really shouldn't call liveProcessTranscript from here, it's in the back end process lol.
  // I'm surprised it even works, probably won't work when we try to build the app for production
  return liveProcessTranscript(transcription);
};

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

    return processTranscript(updatedTranscription);
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

    return processTranscript(updatedTranscription);
  }

  if (action.type === PASTE_WORD) {
    const { startIndex, clipboard } = action.payload as PasteWordsPayload;

    const prefix = transcription.words.slice(0, startIndex + 1);
    const suffix = transcription.words.slice(startIndex + 1);

    const updatedTranscription = {
      ...transcription,
      words: [...prefix, ...clipboard, ...suffix],
    };

    return processTranscript(updatedTranscription);
  }

  if (action.type === UNDO_PASTE_WORD) {
    const { startIndex, clipboardLength } =
      action.payload as UndoPasteWordsPayload;

    const prefix = transcription.words.slice(0, startIndex + 1);
    const suffix = transcription.words.slice(startIndex + clipboardLength + 1);

    const updatedTranscription = {
      ...transcription,
      words: [...prefix, ...suffix],
    };
    return processTranscript(updatedTranscription);
  }

  return transcription;
};

export default transcriptionReducer;
