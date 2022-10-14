/**
 * Clipboard shortcuts in the menu only do the default action,
 * so for each of these actions also invoke the app-specific handler.
 */

import { copyText, cutText, pasteText } from './editor/clipboard';

const registerClipboardHandlers: () => Promise<void> = async () => {
  const actionToHandlerMap: Record<string, () => void> = {
    cut: cutText,
    copy: copyText,
    paste: pasteText,
  };

  Object.keys(actionToHandlerMap).forEach((key) => {
    document.addEventListener(key, () => {
      actionToHandlerMap[key]();
    });
  });
};

export default registerClipboardHandlers;
