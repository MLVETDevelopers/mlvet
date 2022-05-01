import { Project } from 'sharedTypes';
import { RECENT_PROJECTS_LOADED, RECENT_PROJECT_ADDED } from '../actions';
import { Action, ApplicationStore, initialStore } from '../helpers';

const recentProjectsReducer: (
  recentProjects: ApplicationStore['recentProjects'],
  action: Action<any>
) => ApplicationStore['recentProjects'] = (
  recentProjects = initialStore.recentProjects,
  action
) => {
  if (action.type === RECENT_PROJECT_ADDED) {
    return [action.payload as Project, ...recentProjects];
  }

  if (action.type === RECENT_PROJECTS_LOADED) {
    return action.payload as Project[];
  }

  return recentProjects;
};

export default recentProjectsReducer;
