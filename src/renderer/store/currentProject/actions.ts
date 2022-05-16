import { Project, ProjectMetadata } from '../../../sharedTypes';
import { Action } from '../action';

export const PROJECT_CREATED = 'PROJECT_CREATED';
export const PROJECT_OPENED = 'PROJECT_OPENED';
export const CURRENT_PROJECT_CLOSED = 'CURRENT_PROJECT_CLOSED';
export const PROJECT_SAVED = 'PROJECT_SAVED';
export const PROJECT_SAVED_FIRST_TIME = 'PROJECT_SAVED_FIRST_TIME';

export const projectCreated: (project: Project) => Action<Project> = (
  project
) => ({
  type: PROJECT_CREATED,
  payload: project,
});

export const projectOpened: (
  project: Project,
  filePath: string | null
) => Action<{ project: Project; filePath: string | null }> = (
  project,
  filePath
) => ({
  type: PROJECT_OPENED,
  payload: { project, filePath },
});

export const projectSaved: (
  projectId: string,
  filePath: string
) => Action<{
  projectId: string;
  filePath: string;
}> = (projectId, filePath) => ({
  type: PROJECT_SAVED,
  payload: { projectId, filePath },
});

export const projectSavedFirstTime: (
  project: Project,
  metadata: ProjectMetadata,
  filePath: string
) => Action<{
  project: Project;
  metadata: ProjectMetadata;
  filePath: string;
}> = (project, metadata, filePath) => ({
  type: PROJECT_SAVED,
  payload: { project, metadata, filePath },
});

export const currentProjectClosed: () => Action<null> = () => ({
  type: CURRENT_PROJECT_CLOSED,
  payload: null,
});
