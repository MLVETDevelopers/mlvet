// Let TypeScript know that the ipcRenderer is on the window object.
// IPC methods declared in main/handlers will be auto-generated here when `yarn gen` is run.
// If you need to use other modules from electron in the renderer, add their types here and then reference from `ipc` (import from renderer/ipc.ts)

import { BrowserWindow, IpcRendererEvent } from 'electron';
import { SaveDialogSelections } from 'main/handlers/helpers/saveDialog';
import { TranscriptionEngine } from 'main/handlers/helpers/transcribeTypes';
import { JSONTranscription } from 'main/types';
import {
  OperatingSystems,
  RuntimeProject,
  ProjectMetadata,
  RecentProject,
  Transcription,
  ProjectIdAndFilePath,
} from '../sharedTypes';

declare global {
  interface Window {
    electron: {
      // Everything between the START GENERATED CODE and END GENERATED CODE comments will be replaced with the injected handler invocations when 'yarn gen' is run

      // START GENERATED CODE
      deleteProject: (project: ProjectIdAndFilePath) => Promise<void>;

      openExternalLink: (url: string) => Promise<void>;

      openProject: (
        filePath: string | null
      ) => Promise<{ project: RuntimeProject | null; filePath: string }>;

      retrieveProjectMetadata: (
        project: Pick<RuntimeProject, 'projectFilePath' | 'mediaFilePath'>
      ) => Promise<ProjectMetadata>;

      readRecentProjects: () => Promise<RecentProject[]>;

      requestMediaDialog: () => Promise<string | null>;

      requireCloudConfig: () => Promise<boolean>;

      saveAsProject: (project: RuntimeProject) => Promise<string>;

      saveChangesDialog: (
        mainWindow: BrowserWindow,
        projectFileName?: string
      ) => SaveDialogSelections;

      saveProject: (project: RuntimeProject) => Promise<string>;

      storeCloudCredentials: (data: string) => Promise<void>;

      writeRecentProjects: (recentProjects: RecentProject[]) => Promise<void>;

      extractAudio: (project: RuntimeProject) => Promise<string>;

      exportProject: (project: RuntimeProject) => Promise<string>;

      extractThumbnail: (
        absolutePathToVideoFile: string,
        project: RuntimeProject
      ) => Promise<string>;

      loadThumbnail: (projectId: string) => Promise<string>;

      transcribe: (
        project: RuntimeProject,
        transcriptionEngine: TranscriptionEngine
      ) => Promise<JSONTranscription>;

      requestTranscription: (
        project: RuntimeProject
      ) => Promise<Transcription | null>;

      setConfidenceLinesEnabled: (menuItemEnabled: boolean) => void;

      setExportEnabled: (exportEnabled: boolean) => void;

      setFileRepresentation: (
        representedFilePath: string | null,
        isEdited: boolean
      ) => void;

      setHomeEnabled: (homeEnabled: boolean) => void;

      setMergeSplitEnabled: (
        mergeEnabled: boolean,
        splitEnabled: boolean
      ) => void;

      setSaveEnabled: (saveEnabled: boolean, saveAsEnabled: boolean) => void;

      setUndoRedoEnabled: (undoEnabled: boolean, redoEnabled: boolean) => void;

      getFileNameWithExtension: (filePath: string | null) => Promise<string>;

      handleOsQuery: () => Promise<OperatingSystems | null>;

      setClipboardEnabled: (
        cutEnabled: boolean,
        copyEnabled: boolean,
        pasteEnabled: boolean,
        deleteEnabled: boolean
      ) => Promise<void>;

      closeWindow: () => void;

      promptSave: (_?: void) => Promise<boolean>;

      returnToHome: (project: RuntimeProject) => Promise<number>;

      showConfirmation: (message: string, detail: string) => Promise<boolean>;
      // END GENERATED CODE

      on: (
        channel: string,
        listener: (event: IpcRendererEvent, ...args: any[]) => void
      ) => void;
    };
  }
}
export {};
