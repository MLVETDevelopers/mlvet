import { Project, RecentProject } from '../../../sharedTypes';
import { Action } from '../action';
import { PROJECT_OPENED, PROJECT_SAVED } from '../currentProject/actions';

export const RECENT_PROJECT_ADDED = 'RECENT_PROJECT_ADDED';
export const RECENT_PROJECTS_LOADED = 'RECENT_PROJECTS_LOADED';

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

export const recentProjectAdded: (
  project: RecentProject
) => Action<RecentProject> = (project) => ({
  type: RECENT_PROJECT_ADDED,
  payload: project,
});

export const recentProjectsLoaded: (
  recentProjects: RecentProject[]
) => Action<RecentProject[]> = (recentProjects) => ({
  type: RECENT_PROJECTS_LOADED,
  payload: recentProjects,
});
