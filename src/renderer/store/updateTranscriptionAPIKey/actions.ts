import { Action } from '../action';

export const UPDATE_TRANSCRIPTION_API_KEY_TOGGLED =
  'UPDATE_TRANSCRIPTION_API_KEY_TOGGLED';

export const toggleUpdateTranscriptionAPIKey: (
  updateTranscriptionAPIKeyOpened: boolean
) => Action<boolean> = (updateTranscriptionAPIKeyOpened) => ({
  type: UPDATE_TRANSCRIPTION_API_KEY_TOGGLED,
  payload: updateTranscriptionAPIKeyOpened,
});
