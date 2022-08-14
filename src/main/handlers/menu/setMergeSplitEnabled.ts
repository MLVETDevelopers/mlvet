import { IpcContext } from '../../types';
import setMenuButtonEnabled from '../helpers/menuUtils';

type SetMergeSplitEnabled = (
  ipcContext: IpcContext,
  undoEnabled: boolean,
  redoEnabled: boolean
) => void;

const setMergeSplitEnabled: SetMergeSplitEnabled = async (
  ipcContext,
  mergeEnabled,
  splitEnabled
) => {
  const { menu } = ipcContext;

  setMenuButtonEnabled(menu, 'edit', 'mergeWords', mergeEnabled);
  setMenuButtonEnabled(menu, 'edit', 'splitWords', splitEnabled);
};

export default setMergeSplitEnabled;
