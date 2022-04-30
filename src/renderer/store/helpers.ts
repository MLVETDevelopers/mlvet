import { Project } from '../../sharedTypes';
import { DoPayload, UndoPayload } from './opPayloads';

export enum ApplicationPage {
  HOME = 'HOME',
  PROJECT = 'PROJECT',
}

export type Action<T> = {
  type: string;
  payload: T;
};

export interface Op<T extends DoPayload, U extends UndoPayload> {
  do: Action<T>;
  undo: Action<U>;
}

export interface UndoStack {
  stack: Op<DoPayload, UndoPayload>[];
  index: number; // Used for supporting redo
}

export interface ApplicationStore {
  currentProject: Project | null;
  recentProjects: Project[];
  currentPage: ApplicationPage;
  undoStack: UndoStack;
}

const baseMockProject: Omit<Project, 'name'> = {
  schemaVersion: 1,
  mediaType: 'video',
  filePath: 'fakepath',
  fileExtension: 'mp4',
  transcription: null,
};

export const initialStore: ApplicationStore = {
  currentProject: null,
  recentProjects: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'].map(
    (name) => ({ ...baseMockProject, name: `${name} Project` })
  ),
  currentPage: ApplicationPage.HOME,
  undoStack: { stack: [], index: 0 },
};
