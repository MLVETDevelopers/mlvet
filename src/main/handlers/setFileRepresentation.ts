import path from 'path';
import { IpcContext } from '../types';

type SetFileRepresentation = (
  ipcContext: IpcContext,
  representedFilePath: string | null,
  isEdited: boolean
) => void;

const setFileRepresentation: SetFileRepresentation = (
  ipcContext,
  representedFilePath,
  isEdited
) => {
  const { mainWindow } = ipcContext;

  mainWindow.setTitle(
    representedFilePath === null
      ? 'Machine Learning Video Editor Toolkit'
      : path.basename(representedFilePath)
  );
  mainWindow.setRepresentedFilename(representedFilePath ?? '');
  mainWindow.setDocumentEdited(isEdited);
};

export default setFileRepresentation;
