import { IpcContext } from '../../types';
import setMenuButtonEnabled from '../helpers/menuUtils';

type SetHomeEnabled = (ipcContext: IpcContext, homeEnabled: boolean) => void;

const setHomeEnabled: SetHomeEnabled = async (ipcContext, homeEnabled) => {
  const { menu } = ipcContext;

  setMenuButtonEnabled(menu, 'history', 'home', homeEnabled);
};

export default setHomeEnabled;
