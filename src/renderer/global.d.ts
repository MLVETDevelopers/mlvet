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

      showImportMediaDialog: () => Promise<string | null>;

      getFileNameWithExtension: (filePath: string | null) => string;

      handleOpenProject: (
        filePath: string | null
      ) => Promise<{ project: Project; filePath: string }>;

      handleOsQuery: () => OperatingSystems | null;

      retrieveProjectMetadata: (
        project: Pick<Project, 'projectFilePath' | 'mediaFilePath'>
      ) => Promise<ProjectMetadata>;

      readRecentProjects: () => Promise<RecentProject[]>;

      handleSaveAsProject: (project: Project) => Promise<string>;

      handleSaveProject: (project: Project) => Promise<string>;

      extractThumbnail: (absolutePathToVideoFile: string) => Promise<string>;

      handleTranscription: (project: Project) => Promise<Transcription | null>;

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
