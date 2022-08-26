import { Reducer } from 'redux';
import { updateOutputTimes } from 'transcriptProcessing/updateOutputTimes';
import { Transcription } from '../../../sharedTypes';
import { Action } from '../action';
import transcriptionWordsReducer from '../transcriptionWords/reducer';
import { TRANSCRIPTION_CREATED } from './actions';
import {
  DELETE_SELECTION,
  MERGE_WORDS,
  PASTE_WORD,
  SPLIT_WORD,
  UNDO_DELETE_SELECTION,
  UNDO_MERGE_WORDS,
  UNDO_PASTE_WORD,
  UNDO_SPLIT_WORD,
} from '../transcriptionWords/actions';
import { SELECT_TAKE } from '../takeDetection/actions';
import transcriptionTakesReducer from '../transcriptionTakes/reducer';

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
      MERGE_WORDS,
      UNDO_MERGE_WORDS,
      SPLIT_WORD,
      UNDO_SPLIT_WORD,
    ].includes(action.type)
  ) {
    return {
      ...transcription,
      ...updateOutputTimes(
        transcriptionWordsReducer(transcription.words, action)
      ),
    };
  }

  // Delegate take-related actions to takes reducer
  if ([SELECT_TAKE].includes(action.type)) {
    return {
      ...transcription,
      ...transcriptionTakesReducer(transcription.words, action),
    };
  }

  return transcription;
};

export default transcriptionReducer;
