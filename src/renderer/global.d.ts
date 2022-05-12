// Let TypeScript know that the ipcRenderer is on the window object.
// If you need to use other modules from electron in the renderer, add their types here and then reference from window.electron

import { IpcRendererEvent } from 'electron';
import {
  Project,
  ProjectMetadata,
  Transcription,
  OperatingSystems,
  RecentProject,
} from '../sharedTypes';

declare global {
  interface Window {
    electron: {
      requestMediaDialog: () => Promise<string | null>;
      requestTranscription: (filePath: string) => Promise<Transcription>;
      saveProject: (project: Project) => Promise<string>; // Returns the file path
      openProject: () => Promise<{ project: Project; filePath: string }>;
      setUndoRedoEnabled: (undoEnabled: boolean, redoEnabled: boolean) => void;
      extractThumbnail: (filePath: string) => Promise<string>;
      userOS: () => Promise<OperatingSystems>;
      readRecentProjects: () => Promise<RecentProject[]>;
      writeRecentProjects: (recentProjects: RecentProject[]) => Promise<void>;
      retrieveProjectMetadata: (project: Project) => Promise<ProjectMetadata>;

      on: (
        channel: string,
        listener: (event: IpcRendererEvent, ...args: any[]) => void
      ) => void;
    };
  }
}
export {};
