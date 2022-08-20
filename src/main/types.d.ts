import { BrowserWindow, Menu } from 'electron';
import { PartialWord, RuntimeProject } from 'sharedTypes';
import AppState from './AppState';

export interface JSONTranscription {
  confidence: number;
  words: PartialWord[];
}

// Context to be passed into the IPC handlers when they are initialised from main
export interface IpcContext {
  mainWindow: BrowserWindow;
  menu: Menu;
  appState: AppState;
}
