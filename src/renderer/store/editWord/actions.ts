import { Action } from '../action';

export const EDIT_WORD_STARTED = 'EDIT_WORD_STARTED';
export const EDIT_WORD_UPDATED = 'EDIT_WORD_UPDATED';
export const EDIT_WORD_FINISHED = 'EDIT_WORD_FINISHED';

export interface EditWordStartedPayload {
  index: number;
  text: string;
}

export interface EditWordUpdatedPayload {
  text: string;
}

export const editWordStarted: (
  index: number,
  text: string
) => Action<EditWordStartedPayload> = (index, text) => ({
  type: EDIT_WORD_STARTED,
  payload: { index, text },
});

export const editWordUpdated: (
  text: string
) => Action<EditWordUpdatedPayload> = (text) => ({
  type: EDIT_WORD_UPDATED,
  payload: { text },
});

/**
 * Finished could mean cancelled or saved - the actual
 * saving operation is handled by the transcriptionWordReducer
 */
export const editWordFinished: () => Action<null> = () => ({
  type: EDIT_WORD_FINISHED,
  payload: null,
});
