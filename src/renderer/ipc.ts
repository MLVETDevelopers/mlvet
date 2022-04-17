import { Project, Transcription } from '../sharedTypes';

const { ipcRenderer } = window.electron;

export const requestTranscription: (
  filePath: string
) => Promise<Transcription> = (filePath) =>
  ipcRenderer.invoke('transcribe-media', filePath);

export const saveProject: (project: Project) => Promise<void> = (project) =>
  ipcRenderer.invoke('save-project', project);
