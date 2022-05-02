import { Reducer } from 'redux';
import { Project } from 'sharedTypes';
import { RECENT_PROJECTS_LOADED, RECENT_PROJECT_ADDED } from '../actions';
import { Action, ApplicationStore, initialStore } from '../helpers';

const recentProjectsReducer: Reducer<
  ApplicationStore['recentProjects'],
  Action<any>
> = (recentProjects = initialStore.recentProjects, action) => {
  if (action.type === RECENT_PROJECT_ADDED) {
    return [action.payload as Project, ...recentProjects];
  }

  if (action.type === RECENT_PROJECTS_LOADED) {
    return action.payload as Project[];
  }

  return recentProjects;
};

export default recentProjectsReducer;
