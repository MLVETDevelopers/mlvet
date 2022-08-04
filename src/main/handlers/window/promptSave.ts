import promptToSaveWork from '../../promptToSaveWork';
import { IpcContext } from '../../types';

// empty param because of gencode edge case

type PromptSave = (ipcContext: IpcContext, _?: void) => Promise<boolean>;

const promptSave: PromptSave = async (ipcContext) => {
  const { mainWindow, appState } = ipcContext;

  return promptToSaveWork(mainWindow, appState, false);
};

export default promptSave;
