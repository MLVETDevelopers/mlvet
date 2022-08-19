import { IpcContext } from '../../types';
import setMenuButtonEnabled from '../helpers/menuUtils';

type SetMergeSplitEnabled = (
  ipcContext: IpcContext,
  mergeEnabled: boolean,
  splitEnabled: boolean
) => void;

const setMergeSplitEnabled: SetMergeSplitEnabled = async (
  ipcContext,
  mergeEnabled,
  splitEnabled
) => {
  const { menu } = ipcContext;

  setMenuButtonEnabled(menu, 'edit', 'mergeWords', mergeEnabled);
  setMenuButtonEnabled(menu, 'edit', 'splitWord', splitEnabled);
};

export default setMergeSplitEnabled;
