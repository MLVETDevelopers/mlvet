import { Project } from '../../sharedTypes';
import { UndoPayload } from './opPayloads';

export type Action<T> = {
  type: string;
  payload: T;
};

export enum ApplicationPage {
  HOME = 'HOME',
  PROJECT = 'PROJECT',
}

export type UndoStack = Action<UndoPayload>[];

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
  undoStack: [],
};
