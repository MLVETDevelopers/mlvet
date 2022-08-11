import { IpcContext } from '../../types';
import setMenuButtonEnabled from '../helpers/menuUtils';

type SetExportEnabled = (
  ipcContext: IpcContext,
  exportEnabled: boolean
) => void;

const setExportEnabled: SetExportEnabled = async (
  ipcContext,
  exportEnabled
) => {
  const { menu } = ipcContext;

  setMenuButtonEnabled(menu, 'file', 'export', exportEnabled);
};

export default setExportEnabled;
