// Let TypeScript know that the ipcRenderer is on the window object.
// If you need to use other modules from electron in the renderer, add their types here and then reference from window.electron

import { Transcription } from './store/helpers';

declare global {
  interface Window {
    electron: {
      requestMediaDialog: () => Promise<string | null>;
      requestTranscription: (filePath: string) => Promise<Transcription>;
    };
  }
}
export {};
