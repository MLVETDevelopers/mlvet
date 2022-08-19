import { BrowserWindow, Menu } from 'electron';
import { PartialWord, RuntimeProject } from 'sharedTypes';
import AppState from './AppState';

export interface SnakeCaseWord {
  word: string;
  duration: number;
  start_time: number; // TODO: change this to camel case before it touches TS
}

export interface JSONTranscription {
  confidence: number;
  words: PartialWord[];
}

export type TranscriptionFunction = (
  project: RuntimeProject
) => Promise<JSONTranscription>;

// Context to be passed into the IPC handlers when they are initialised from main
export interface IpcContext {
  mainWindow: BrowserWindow;
  menu: Menu;
  appState: AppState;
}
