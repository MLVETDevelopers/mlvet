import { Reducer } from 'redux';
import liveProcessTranscript from 'main/editDelete/liveProcess';
import { TRANSCRIPTION_CREATED } from './actions';
import { Transcription } from '../../../sharedTypes';
import { Action } from '../action';
import { DeleteWordsPayload } from '../undoStack/opPayloads';
import { DELETE_WORD, UNDO_DELETE_WORD } from '../undoStack/ops';

const processTranscript = (transcription: Transcription) => {
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

  // If you add a method that handles edits to the transcription -> processTranscript()

  if (
    (action.type === DELETE_WORD || action.type === UNDO_DELETE_WORD) &&
    transcription != null
  ) {
    const { startIndex, endIndex } = action.payload as DeleteWordsPayload;

    // sets newDeleted bool to true for delete and false for undo
    const newDeletedBool = action.type === DELETE_WORD;

    const updatedTranscription = {
      ...transcription,
      words: transcription.words.map((word, i) => ({
        ...word,
        deleted:
          i >= startIndex && i <= endIndex ? newDeletedBool : word.deleted,
      })),
    };

    return processTranscript(updatedTranscription);
  }

  return transcription;
};

export default transcriptionReducer;
