import { IpcContext } from '../types';
import setMenuButtonEnabled from './helpers/menuUtils';

type SetSaveEnabled = (
  ipcContext: IpcContext,
  saveEnabled: boolean,
  saveAsEnabled: boolean
) => void;

const setSaveEnabled: SetSaveEnabled = async (
  ipcContext,
  saveEnabled,
  saveAsEnabled
) => {
  const { menu } = ipcContext;

  setMenuButtonEnabled(menu, 'file', 'save', saveEnabled);
  setMenuButtonEnabled(menu, 'file', 'saveAs', saveAsEnabled);
};

export default setSaveEnabled;
