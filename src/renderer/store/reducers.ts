import { combineReducers } from 'redux';
import {
  PROJECT_CREATED,
  CURRENT_PROJECT_CLOSED,
  RECENT_PROJECT_ADDED,
  Action,
} from './actions';
import { ApplicationStore, initialStore, Project } from './helpers';

const currentProjectReducer = (
  currentProject: ApplicationStore['currentProject'] = initialStore.currentProject,
  action: Action<any>
) => {
  if (action.type === PROJECT_CREATED) {
    return action.payload as Project;
  }

  if (action.type === CURRENT_PROJECT_CLOSED) {
    return undefined;
  }

  return currentProject;
};

const recentProjectsReducer = (
  recentProjects: ApplicationStore['recentProjects'] = initialStore.recentProjects,
  action: Action<any>
) => {
  if (action.type === RECENT_PROJECT_ADDED) {
    if (recentProjects === undefined) {
      return [action.payload as Project];
    }
    return [action.payload as Project, ...recentProjects];
  }

  return recentProjects;
};

const rootReducer = combineReducers({
  currentProject: currentProjectReducer,
  recentProjects: recentProjectsReducer,
});

export default rootReducer;
