import { Transcription } from '../../../sharedTypes';
import { TRANSCRIPTION_CREATED } from '../actions';
import { Action } from '../helpers';

/**
 *  Nested reducer for handling transcriptions
 */
const transcriptionReducer: (
  transcription: Transcription | null,
  action: Action<any>
) => Transcription | null = (transcription, action) => {
  if (action.type === TRANSCRIPTION_CREATED) {
    return action.payload as Transcription;
  }

  return transcription;
};

export default transcriptionReducer;
