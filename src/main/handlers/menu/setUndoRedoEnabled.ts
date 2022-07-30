import { IpcContext } from '../../types';
import setMenuButtonEnabled from '../helpers/menuUtils';

type SetUndoRedoEnabled = (
  ipcContext: IpcContext,
  undoEnabled: boolean,
  redoEnabled: boolean
) => void;

const setUndoRedoEnabled: SetUndoRedoEnabled = async (
  ipcContext,
  undoEnabled,
  redoEnabled
) => {
  const { menu } = ipcContext;

  setMenuButtonEnabled(menu, 'edit', 'undo', undoEnabled);
  setMenuButtonEnabled(menu, 'edit', 'redo', redoEnabled);
};

export default setUndoRedoEnabled;
