// Let TypeScript know that the ipcRenderer is on the window object.
// If you need to use other modules from electron in the renderer, add their types here and then reference from window.electron

import { IpcRenderer } from 'electron';

declare global {
  interface Window {
    electron: {
      ipcRenderer: IpcRenderer;
    };
  }
}
export {};
