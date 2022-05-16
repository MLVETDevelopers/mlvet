// Let TypeScript know that the ipcRenderer is on the window object.
// IPC methods declared in main/handlers will be auto-generated here when `yarn gen` is run.
// If you need to use other modules from electron in the renderer, add their types here and then reference from `ipc` (import from renderer/ipc.ts)

import { IpcRendererEvent } from 'electron';
import {
  OperatingSystems,
  Project,
  ProjectMetadata,
  RecentProject,
  Transcription,
} from '../sharedTypes';

declare global {
  interface Window {
    electron: {
      // Everything between the START GENERATED CODE and END GENERATED CODE comments will be replaced with the injected handler invocations when 'yarn gen' is run

      // START GENERATED CODE
      extractAudio: (project: Project) => Promise<string>;

      closeWindow: () => void;

      getFileNameWithExtension: (filePath: string | null) => Promise<string>;

      openProject: (
        filePath: string | null
      ) => Promise<{ project: Project; filePath: string }>;

      handleOsQuery: () => OperatingSystems | null;

      retrieveProjectMetadata: (
        project: Pick<Project, 'projectFilePath' | 'mediaFilePath'>
      ) => Promise<ProjectMetadata>;

      readRecentProjects: () => Promise<RecentProject[]>;

      requestMediaDialog: () => Promise<string | null>;

      saveAsProject: (project: Project) => Promise<string>;

      saveProject: (project: Project) => Promise<string>;

      setFileRepresentation: (
        representedFilePath: string | null,
        isEdited: boolean
      ) => void;

      setSaveEnabled: (saveEnabled: boolean, saveAsEnabled: boolean) => void;

      setUndoRedoEnabled: (undoEnabled: boolean, redoEnabled: boolean) => void;

      extractThumbnail: (absolutePathToVideoFile: string) => Promise<string>;

      requestTranscription: (project: Project) => Promise<Transcription | null>;

      writeRecentProjects: (recentProjects: RecentProject[]) => Promise<void>;
      // END GENERATED CODE

      on: (
        channel: string,
        listener: (event: IpcRendererEvent, ...args: any[]) => void
      ) => void;
    };
  }
}
export {};
