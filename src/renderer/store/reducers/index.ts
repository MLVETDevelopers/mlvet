import { combineReducers } from 'redux';
import currentPageReducer from './currentPageReducer';
import currentProjectReducer from './currentProjectReducer';
import recentProjectsReducer from './recentProjectsReducer';

const rootReducer = combineReducers({
  currentProject: currentProjectReducer,
  recentProjects: recentProjectsReducer,
  currentPage: currentPageReducer,
});

export default rootReducer;
