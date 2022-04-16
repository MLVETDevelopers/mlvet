import { Transcription } from './store/helpers';

const { ipcRenderer } = window.electron;

const requestTranscription: (filePath: string) => Promise<Transcription> = (
  filePath
) => ipcRenderer.invoke('transcribe-media', filePath);

export default requestTranscription;
