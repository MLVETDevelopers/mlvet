import { Project, Transcription } from '../../sharedTypes';
import { ApplicationPage } from './helpers';

export type Action<T> = {
  type: string;
  payload: T;
};

export const PROJECT_CREATED = 'PROJECT_CREATED';
export const PROJECT_OPENED = 'PROJECT_OPENED';
export const CURRENT_PROJECT_CLOSED = 'CURRENT_PROJECT_CLOSED';
export const RECENT_PROJECT_ADDED = 'RECENT_PROJECT_ADDED';
export const TRANSCRIPTION_CREATED = 'TRANSCRIPTION_CREATED';
export const PAGE_CHANGED = 'PAGE_CHANGED';

export const projectCreated: (project: Project) => Action<Project> = (
  project
) => ({
  type: PROJECT_CREATED,
  payload: project,
});

export const projectOpened: (project: Project) => Action<Project> = (
  project
) => ({
  type: PROJECT_OPENED,
  payload: project,
});

export const currentProjectClosed: () => Action<null> = () => ({
  type: CURRENT_PROJECT_CLOSED,
  payload: null,
});

export const recentProjectAdded: (project: Project) => Action<Project> = (
  project
) => ({
  type: RECENT_PROJECT_ADDED,
  payload: project,
});

export const transcriptionCreated: (
  transcription: Transcription
) => Action<Transcription> = (transcription) => ({
  type: TRANSCRIPTION_CREATED,
  payload: transcription,
});

export const pageChanged: (page: ApplicationPage) => Action<ApplicationPage> = (
  page
) => ({
  type: PAGE_CHANGED,
  payload: page,
});
