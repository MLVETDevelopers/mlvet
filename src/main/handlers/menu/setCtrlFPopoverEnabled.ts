import { IpcContext } from '../../types';
import setMenuButtonEnabled from '../helpers/menuUtils';

type SetCtrlFPopoverEnabled = (
  ipcContext: IpcContext,
  menuItemEnabled: boolean
) => void;

const setCtrlFPopoverEnabled: SetCtrlFPopoverEnabled = async (
  ipcContext,
  menuItemEnabled
) => {
  const { menu } = ipcContext;

  setMenuButtonEnabled(menu, 'edit', 'find', menuItemEnabled);
};

export default setCtrlFPopoverEnabled;
