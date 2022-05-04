import { combineReducers } from 'redux';
import currentPageReducer from './currentPageReducer';
import currentProjectReducer from './currentProjectReducer';
import exportIoReducer from './exportIoReducer';
import recentProjectsReducer from './recentProjectsReducer';
import undoStackReducer from './undoStackReducer';

const rootReducer = combineReducers({
  currentProject: currentProjectReducer,
  recentProjects: recentProjectsReducer,
  currentPage: currentPageReducer,
  undoStack: undoStackReducer,
  exportIo: exportIoReducer,
});

export default rootReducer;
