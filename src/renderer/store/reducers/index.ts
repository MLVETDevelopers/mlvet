import { combineReducers } from 'redux';
import currentPageReducer from './currentPageReducer';
import currentProjectReducer from './currentProjectReducer';
import ioReducer from './ioReducer';
import recentProjectsReducer from './recentProjectsReducer';
import undoStackReducer from './undoStackReducer';

const rootReducer = combineReducers({
  currentProject: currentProjectReducer,
  recentProjects: recentProjectsReducer,
  currentPage: currentPageReducer,
  undoStack: undoStackReducer,
  io: ioReducer,
});

export default rootReducer;
