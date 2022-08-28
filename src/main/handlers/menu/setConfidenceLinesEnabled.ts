import { IpcContext } from '../../types';
import setMenuButtonEnabled from '../helpers/menuUtils';

type SetConfidenceLinesEnabled = (
  ipcContext: IpcContext,
  menuItemEnabled: boolean
) => void;

const setConfidenceLinesEnabled: SetConfidenceLinesEnabled = async (
  ipcContext,
  menuItemEnabled
) => {
  const { menu } = ipcContext;

  setMenuButtonEnabled(menu, 'edit', 'confidence', menuItemEnabled);
};

export default setConfidenceLinesEnabled;
