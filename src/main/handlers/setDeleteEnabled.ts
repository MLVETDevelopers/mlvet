import { IpcContext } from '../types';
import setMenuButtonEnabled from './helpers/menuUtils';

type SetDeleteEnabled = (
  ipcContext: IpcContext,
  deleteEnabled: boolean
) => Promise<void>;

const setDeleteEnabled: SetDeleteEnabled = async (
  ipcContext,
  deleteEnabled
) => {
  const { menu } = ipcContext;

  setMenuButtonEnabled(menu, 'edit', 'delete', deleteEnabled);
  setMenuButtonEnabled(menu, 'edit', 'delete2', deleteEnabled);
};

export default setDeleteEnabled;
