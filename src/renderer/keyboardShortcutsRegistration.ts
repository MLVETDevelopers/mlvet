/**
 * On Windows and Linux, for some undiagnosed reason, some (but not all)
 * keyboard shortcuts don't work. This file resolves that issue by manually
 * re-registering the handlers for the specific affected shortcuts.
 */

import { OperatingSystems } from 'sharedTypes';
import { copyText, cutText, pasteText } from './editor/clipboard';
import { selectAllWords } from './editor/selection';
import store from './store/store';
import ipc from './ipc';
import { spacePressed } from './store/spacebar/actions';

/**
 * Each key represents pressing Ctrl plus that key.
 */
const keyToHandlerMap: Record<string, () => void> = {
  x: cutText,
  c: copyText,
  v: pasteText,
  a: selectAllWords,
};

const registerKeyboardHandlers: () => Promise<void> = async () => {
  const os = await ipc.handleOsQuery();

  // Issue only affects Windows and Linux, so ignore for Mac
  if (os === null || os === OperatingSystems.MACOS) {
    return;
  }

  window.onkeydown = (event: KeyboardEvent) => {
    if (event.key === ' ') {
      const state = store.getState().isSpacePressed;
      store.dispatch(spacePressed(!state));
    }

    if (!event.ctrlKey) {
      return;
    }

    if (Object.keys(keyToHandlerMap).includes(event.key)) {
      // Invoke the appropriate handler
      keyToHandlerMap[event.key]();
    }
  };
};

export default registerKeyboardHandlers;
