import { Reducer } from 'redux';
import { updateOutputStartTimes } from 'transcriptProcessing/updateOutputStartTimes';
import {
  DELETE_SELECTION,
  PASTE_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_PASTE_WORD,
} from '../transcriptionWords/actions';
import { Transcription } from '../../../sharedTypes';
import { Action } from '../action';
import transcriptionWordsReducer from '../transcriptionWords/reducer';
import { TRANSCRIPTION_CREATED } from './actions';

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

  // Delegate words-related actions to words reducer
  if (
    [
      DELETE_SELECTION,
      UNDO_DELETE_SELECTION,
      PASTE_WORD,
      UNDO_PASTE_WORD,
    ].includes(action.type)
  ) {
    return {
      ...transcription,
      words: updateOutputStartTimes(
        transcriptionWordsReducer(transcription.words, action)
      ),
    };
  }

  return transcription;
};

export default transcriptionReducer;
