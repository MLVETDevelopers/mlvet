import { IpcContext } from '../../types';
import setMenuButtonEnabled from '../helpers/menuUtils';

type SetSelectSentenceEnabled = (
  ipcContext: IpcContext,
  enabled: boolean
) => void;

const setSelectSentenceEnabled: SetSelectSentenceEnabled = async (
  ipcContext,
  enabled
) => {
  const { menu } = ipcContext;
  setMenuButtonEnabled(menu, 'edit', 'selectSentence', enabled);
};

export default setSelectSentenceEnabled;
