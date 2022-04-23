import { combineReducers } from 'redux';
import {
  PROJECT_CREATED,
  CURRENT_PROJECT_CLOSED,
  RECENT_PROJECT_ADDED,
  Action,
  TRANSCRIPTION_CREATED,
  PROJECT_OPENED,
  PAGE_CHANGED,
} from './actions';
import { ApplicationStore, ApplicationPage, initialStore } from './helpers';
import { Project, Transcription } from '../../sharedTypes';

const currentProjectReducer: (
  currentProject: ApplicationStore['currentProject'],
  action: Action<any>
) => ApplicationStore['currentProject'] = (
  currentProject = initialStore.currentProject,
  action
) => {
  if (action.type === PROJECT_CREATED || action.type === PROJECT_OPENED) {
    return action.payload as Project;
  }

  if (action.type === CURRENT_PROJECT_CLOSED) {
    return null;
  }

  if (action.type === TRANSCRIPTION_CREATED && currentProject !== null) {
    return {
      ...currentProject,
      transcription: action.payload as Transcription,
    };
  }

  return currentProject;
};

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

  return recentProjects;
};

const currentPageReducer: (
  currentPage: ApplicationStore['currentPage'],
  action: Action<any>
) => ApplicationStore['currentPage'] = (
  currentPage = initialStore.currentPage,
  action
) => {
  if (action.type === PAGE_CHANGED) {
    return action.payload as ApplicationPage;
  }

  return currentPage;
};

const rootReducer = combineReducers({
  currentProject: currentProjectReducer,
  recentProjects: recentProjectsReducer,
  currentPage: currentPageReducer,
});

export default rootReducer;
