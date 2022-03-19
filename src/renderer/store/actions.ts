import { Project } from './helpers';

export type Action<T> = {
  type: string;
  payload: T;
};

export const PROJECT_CREATED = 'PROJECT_CREATED';
export const CURRENT_PROJECT_CLOSED = 'CURRENT_PROJECT_CLOSED';
export const RECENT_PROJECT_ADDED = 'RECENT_PROJECT_ADDED';

export const projectCreated: (project: Project) => Action<Project> = (
  project
) => ({
  type: PROJECT_CREATED,
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
