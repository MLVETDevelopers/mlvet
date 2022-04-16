// Let TypeScript know that the ipcRenderer is on the window object.
// If you need to use other modules from electron in the renderer, add their types here and then reference from window.electron

declare global {
  interface Window {
    electron: {
      requestMediaDialog: () => Promise<string | null>;
    };
  }
}
export {};
