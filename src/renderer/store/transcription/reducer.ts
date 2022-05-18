import { Reducer } from 'redux';
import { TRANSCRIPTION_CREATED } from './actions';
import { Transcription } from '../../../sharedTypes';
import { Action } from '../action';
import { DeleteWordsPayload, PasteWordsPayload } from '../undoStack/opPayloads';
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

  if (
    (action.type === DELETE_WORD || action.type === UNDO_DELETE_WORD) &&
    transcription != null
  ) {
    const { startIndex, endIndex } = action.payload as DeleteWordsPayload;

    // sets newDeleted bool to true for delete and false for undo
    const newDeletedBool = action.type === DELETE_WORD;

    return {
      ...transcription,
      words: transcription.words.map((word, i) => ({
        ...word,
        deleted:
          i >= startIndex && i <= endIndex ? newDeletedBool : word.deleted,
      })),
    };
  }

  if (
    (action.type === PASTE_WORD || action.type === UNDO_PASTE_WORD) &&
    transcription != null
  ) {
    const { toIndex, startIndex, endIndex } =
      action.payload as PasteWordsPayload;

    // Getting the subarrays for the new transcription
    const prefix = transcription?.words.slice(0, toIndex);
    let pasteyWords = transcription?.words.slice(startIndex, endIndex + 1); // Words to be pasted
    pasteyWords = pasteyWords?.map((word) => ({ ...word, deleted: false })); // Undeleting the cut words
    const suffix = transcription?.words.slice(toIndex);

    // Have to check this if to get rid of linter error
    if (pasteyWords !== undefined && suffix !== undefined) {
      return {
        ...transcription,
        words: prefix?.concat(pasteyWords, suffix), // Concatonating the sub arrays
      };
    }
  }

  return transcription;
};

export default transcriptionReducer;
