import { Word } from 'sharedTypes';
import { Action } from '../action';

export const CLIPBOARD_UPDATED = 'CLIPBOARD_UPDATED';

// Action to update the clipboard contents when words are copied
export const clipboardUpdated: (clipboard: Word[]) => Action<Word[]> = (
  clipboard
) => ({
  type: CLIPBOARD_UPDATED,
  payload: clipboard,
});
