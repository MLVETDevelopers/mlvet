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
  CORRECT_WORD,
  UNDO_CORRECT_WORD,
  UNDO_SPLIT_WORD,
  RESTORE_SECTION,
  UNDO_RESTORE_SECTION,
} from '../transcriptionWords/actions';
import { DELETE_TAKE_GROUP, SELECT_TAKE } from '../takeGroups/actions';
import transcriptionTakesReducer from '../transcriptionTakes/reducer';
import takeGroupsReducer from '../takeGroups/reducer';
import {
  FIND_CLOSED,
  FIND_NEXT,
  FIND_PREV,
  FIND_UPDATED,
} from '../transcriptionFind/actions';
import transcriptionFindReducer from '../transcriptionFind/reducer';

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
      CORRECT_WORD,
      UNDO_CORRECT_WORD,
      RESTORE_SECTION,
      UNDO_RESTORE_SECTION,
    ].includes(action.type)
  ) {
    return {
      ...transcription,
      ...updateOutputTimes(
        transcriptionWordsReducer(transcription.words, action),
        transcription.takeGroups
      ),
    };
  }

  // Delegate take-related actions to takes reducer and take groups reducer
  if ([SELECT_TAKE, DELETE_TAKE_GROUP].includes(action.type)) {
    // Update take groups first, so that updateOutputTimes uses the correct take groups
    const takeGroups = takeGroupsReducer(transcription.takeGroups, action);

    return {
      ...transcription,
      ...updateOutputTimes(
        transcriptionTakesReducer(transcription.words, action),
        takeGroups
      ),
      takeGroups,
    };
  }

  // Delegate Ctrl+F actions to find reducer
  if ([FIND_UPDATED, FIND_NEXT, FIND_PREV, FIND_CLOSED].includes(action.type)) {
    return {
      ...transcription,
      ...updateOutputTimes(
        transcriptionFindReducer(transcription.words, action),
        transcription.takeGroups
      ),
    };
  }

  return transcription;
};

export default transcriptionReducer;
