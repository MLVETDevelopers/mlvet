import { RecentProject } from '../../../sharedTypes';
import { Action } from '../action';

export const RECENT_PROJECT_ADDED = 'RECENT_PROJECT_ADDED';
export const RECENT_PROJECTS_LOADED = 'RECENT_PROJECTS_LOADED';

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
