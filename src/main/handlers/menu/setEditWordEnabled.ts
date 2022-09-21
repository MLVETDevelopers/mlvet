import { IpcContext } from '../../types';
import setMenuButtonEnabled from '../helpers/menuUtils';

type SetEditWordEnabled = (
  ipcContext: IpcContext,
  editEnabled: boolean
) => void;

const setEditWordEnabled: SetEditWordEnabled = async (
  ipcContext,
  editEnabled
) => {
  const { menu } = ipcContext;
  setMenuButtonEnabled(menu, 'edit', 'editWord', editEnabled);
};

export default setEditWordEnabled;
