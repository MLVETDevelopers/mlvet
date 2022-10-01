import { combineReducers } from 'redux';
import currentPageReducer from './currentPage/reducer';
import currentProjectReducer from './currentProject/reducer';
import exportIoReducer from './exportIo/reducer';
import recentProjectsReducer from './recentProjects/reducer';
import undoStackReducer from './undoStack/reducer';
import clipboardReducer from './clipboard/reducer';
import selectionReducer from './selection/reducer';
import shortcutsReducer from './shortcuts/reducer';
import menuCustomModalsReducer from './menuCustomModals/reducer';
import editWordReducer from './editWord/reducer';
import confidenceUnderlinesReducer from './confidenceUnderlines/reducer';
import collabReducer from './collab/reducer';
import opQueueReducer from './opQueue/reducer';
import downloadModelReducer from './downloadModel/reducer';

const rootReducer = combineReducers({
  currentProject: currentProjectReducer,
  recentProjects: recentProjectsReducer,
  currentPage: currentPageReducer,
  undoStack: undoStackReducer,
  exportIo: exportIoReducer,
  clipboard: clipboardReducer,
  selection: selectionReducer,
  shortcutsOpened: shortcutsReducer,
  editWord: editWordReducer,
  isShowingConfidenceUnderlines: confidenceUnderlinesReducer,
  menuCustomModals: menuCustomModalsReducer,
  collab: collabReducer,
  opQueue: opQueueReducer,
  downloadModel: downloadModelReducer,
});

export default rootReducer;
