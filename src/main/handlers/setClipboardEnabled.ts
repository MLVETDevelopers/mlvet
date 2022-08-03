import { IpcContext } from '../types';
import setMenuButtonEnabled from './helpers/menuUtils';

type SetClipboardEnabled = (
  ipcContext: IpcContext,
  cutEnabled: boolean,
  copyEnabled: boolean,
  pasteEnabled: boolean,
  deleteEnabled: boolean
) => Promise<void>;

const setClipboardEnabled: SetClipboardEnabled = async (
  ipcContext,
  cutEnabled,
  copyEnabled,
  pasteEnabled,
  deleteEnabled
) => {
  const { menu } = ipcContext;

  setMenuButtonEnabled(menu, 'edit', 'cut', cutEnabled);
  setMenuButtonEnabled(menu, 'edit', 'copy', copyEnabled);
  setMenuButtonEnabled(menu, 'edit', 'paste', pasteEnabled);
  setMenuButtonEnabled(menu, 'edit', 'delete', deleteEnabled);
  setMenuButtonEnabled(menu, 'edit', 'delete2', deleteEnabled);
};

export default setClipboardEnabled;
