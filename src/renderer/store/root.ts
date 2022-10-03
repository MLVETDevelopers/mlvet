import { combineReducers } from 'redux';
import currentPageReducer from './currentPage/reducer';
import currentProjectReducer from './currentProject/reducer';
import exportIoReducer from './exportIo/reducer';
import recentProjectsReducer from './recentProjects/reducer';
import undoStackReducer from './undoStack/reducer';
import clipboardReducer from './clipboard/reducer';
import selectionReducer from './selection/reducer';
import shortcutsReducer from './shortcuts/reducer';
import updateTranscriptionAPIKeyReducer from './updateTranscriptionAPIKey/reducer';
import editWordReducer from './editWord/reducer';
import confidenceUnderlinesReducer from './confidenceUnderlines/reducer';
import collabReducer from './collab/reducer';
import opQueueReducer from './opQueue/reducer';
import transcriptionFindReducer from './transcriptionFind/reducer';

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
  isUpdateTranscriptionAPIKeyOpened: updateTranscriptionAPIKeyReducer,
  collab: collabReducer,
  opQueue: opQueueReducer,
  transcriptionFind: transcriptionFindReducer,
});

export default rootReducer;
