import { BrowserWindow } from 'electron';
import os from 'os';
import path from 'path';
import { OperatingSystems } from '../sharedTypes';

/**
 * A state class for keeping track of represented filename and
 * isDocumentEdited state, on all OS's (rather than just macOS). Updates
 * the relevant displayed value in macOS, but on Windows/Linux we just keep track
 * of the state in the background, so that we can properly display a confirmation
 * dialog when the app closes with unsaved work.
 */
export default class AppState {
  mainWindow: BrowserWindow;

  representedFilePath: string | null;

  isDocumentEdited: boolean;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
    this.representedFilePath = null;
    this.isDocumentEdited = false;
  }

  getRepresentedFilePath() {
    return this.representedFilePath;
  }

  setRepresentedFilePath(representedFilePath: string | null) {
    this.representedFilePath = representedFilePath;
    this.updateWindowState();
  }

  getDocumentEdited() {
    return this.isDocumentEdited;
  }

  setDocumentEdited(isDocumentEdited: boolean) {
    this.isDocumentEdited = isDocumentEdited;
    this.updateWindowState();
  }

  updateWindowState() {
    // Only macOS supports window state (represented file name, title and isDocumentEdited)
    if (os.platform() === OperatingSystems.MACOS) {
      this.mainWindow.setTitle(
        this.representedFilePath === null
          ? 'Machine Learning Video Editor Toolkit'
          : path.basename(this.representedFilePath)
      );
      this.mainWindow.setRepresentedFilename(this.representedFilePath ?? '');
      this.mainWindow.setDocumentEdited(this.isDocumentEdited);
    }
  }
}
