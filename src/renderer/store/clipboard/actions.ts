import ipc from 'renderer/ipc';
import { Action } from '../action';
import { ClipboardContent } from './helpers';

export const CLIPBOARD_UPDATED = 'CLIPBOARD_UPDATED';

const updateClipboardEnabledInMenu: (clipboard: ClipboardContent) => void = (
  clipboard
) => {
  const pasteEnabled = !(
    clipboard.startIndex === 0 && clipboard.endIndex === 0
  );

  // TODO(chloe): smarter logic for this (only enabled cut, copy, delete if there is a selection, etc).
  ipc.setClipboardEnabled(true, true, pasteEnabled, true);
};

// Currently how we check which words have been been copied
// KNOWN ISSUE: if you paste text in, these indexes wont update
//     which means that continued pasting may result in incorrect paste targets.
export const clipboardUpdated: (
  clipboard: ClipboardContent
) => Action<ClipboardContent> = (clipboard) => {
  updateClipboardEnabledInMenu(clipboard);
  return {
    type: CLIPBOARD_UPDATED,
    payload: clipboard,
  };
};
