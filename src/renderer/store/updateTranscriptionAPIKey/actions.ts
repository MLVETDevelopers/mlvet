import { Action } from '../action';

export const UPDATE_TRANSCRIPTION_API_KEY_TOGGLED =
  'UPDATE_TRANSCRIPTION_API_KEY_TOGGLED';

export const toggleUpdateTranscriptionAPIKey: (
  isUpdateTranscriptionAPIKeyOpened: boolean
) => Action<boolean> = (isUpdateTranscriptionAPIKeyOpened) => ({
  type: UPDATE_TRANSCRIPTION_API_KEY_TOGGLED,
  payload: isUpdateTranscriptionAPIKeyOpened,
});
