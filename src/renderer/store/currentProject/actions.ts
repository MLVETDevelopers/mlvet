import { RuntimeProject, ProjectMetadata } from '../../../sharedTypes';
import { Action } from '../action';

export const PROJECT_CREATED = 'PROJECT_CREATED';
export const PROJECT_OPENED = 'PROJECT_OPENED';
export const CURRENT_PROJECT_CLOSED = 'CURRENT_PROJECT_CLOSED';
export const PROJECT_SAVED = 'PROJECT_SAVED';

export const projectCreated: (
  project: RuntimeProject
) => Action<RuntimeProject> = (project) => ({
  type: PROJECT_CREATED,
  payload: project,
});

export const projectOpened: (
  project: RuntimeProject,
  filePath: string | null,
  metadata: ProjectMetadata
) => Action<{
  project: RuntimeProject;
  filePath: string | null;
  metadata: ProjectMetadata;
}> = (project, filePath, metadata) => ({
  type: PROJECT_OPENED,
  payload: { project, filePath, metadata },
});

export const projectSaved: (
  project: RuntimeProject,
  metadata: ProjectMetadata,
  filePath: string
) => Action<{
  project: RuntimeProject;
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
