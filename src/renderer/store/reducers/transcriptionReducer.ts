import { Reducer } from 'redux';
import { TRANSCRIPTION_CREATED } from '../actions';
import { Transcription } from '../../../sharedTypes';
import { Action } from '../helpers';

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

  return transcription;
};

export default transcriptionReducer;
