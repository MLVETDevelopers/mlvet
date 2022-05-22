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
  const { appState } = ipcContext;

  appState.setRepresentedFilePath(representedFilePath);
  appState.setDocumentEdited(isEdited);
};

export default setFileRepresentation;
