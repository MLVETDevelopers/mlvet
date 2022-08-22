import { Transcription } from '../../../sharedTypes';
import { Action } from '../action';

export const TRANSCRIPTION_CREATED = 'TRANSCRIPTION_CREATED';

export const transcriptionCreated: (
  transcription: Transcription
) => Action<Transcription> = (transcription) => ({
  type: TRANSCRIPTION_CREATED,
  payload: transcription,
});
