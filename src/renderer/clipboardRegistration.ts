/**
 * Clipboard shortcuts in the menu only do the default action,
 * so for each of these actions also invoke the app-specific handler.
 */

import { OperatingSystems } from 'sharedTypes';
import { copyText, cutText, pasteText } from './editor/clipboard';
import { selectAllWords } from './editor/selection';
import ipc from './ipc';

const isInTextField: () => boolean = () => {
  return ['input', 'textarea'].includes(
    (document.activeElement?.tagName ?? '').toLowerCase()
  );
};

const registerClipboardHandlers: () => Promise<void> = async () => {
  const os = await ipc.handleOsQuery();

  const actionToHandlerMap: Record<string, () => void> = {
    cut: cutText,
    copy: copyText,
    paste: pasteText,
  };

  const keyToHandlerMap: Record<string, () => void> = {
    a: selectAllWords,
  };

  Object.keys(actionToHandlerMap).forEach((key) => {
    document.addEventListener(key, () => {
      // If in a text field, bypass the app-specific clipboard logic
      if (isInTextField()) {
        return;
      }

      actionToHandlerMap[key]();
    });
  });

  window.onkeydown = (event: KeyboardEvent) => {
    const isCmdPressedMac = os === OperatingSystems.MACOS && event.metaKey;
    const isCtrlPressedNonMac = os !== OperatingSystems.MACOS && event.ctrlKey;

    if (!(isCmdPressedMac || isCtrlPressedNonMac)) {
      return;
    }

    if (Object.keys(keyToHandlerMap).includes(event.key)) {
      // If in a text field, bypass the app-specific clipboard logic
      if (isInTextField()) {
        return;
      }

      // Invoke the appropriate handler
      keyToHandlerMap[event.key]();
    }
  };
};

export default registerClipboardHandlers;
