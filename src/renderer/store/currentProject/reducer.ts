import { Reducer } from 'redux';
import { Project } from '../../../sharedTypes';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';
import {
  CURRENT_PROJECT_CLOSED,
  PROJECT_CREATED,
  PROJECT_OPENED,
  PROJECT_SAVED,
} from './actions';
import {
  CHANGE_WORD_TO_SWAMP,
  DELETE_EVERY_SECOND_WORD,
  UNDO_CHANGE_WORD_TO_SWAMP,
  UNDO_DELETE_EVERY_SECOND_WORD,
} from '../undoStack/ops';
import transcriptionReducer from '../transcription/reducer';
import { TRANSCRIPTION_CREATED } from '../transcription/actions';

const currentProjectReducer: Reducer<
  ApplicationStore['currentProject'],
  Action<any>
> = (currentProject = initialStore.currentProject, action) => {
  if (action.type === PROJECT_CREATED) {
    return action.payload as Project;
  }

  if (action.type === PROJECT_OPENED) {
    return {
      ...(action.payload.project as Project),
      projectFilePath: action.payload.filePath,
    };
  }

  if (action.type === PROJECT_SAVED && currentProject !== null) {
    return {
      ...currentProject,
      projectFilePath: action.payload as string,
    };
  }

  if (action.type === CURRENT_PROJECT_CLOSED) {
    return null;
  }

  // Delegate transcription-related actions to transcription reducer
  if (
    [
      TRANSCRIPTION_CREATED,
      DELETE_EVERY_SECOND_WORD,
      UNDO_DELETE_EVERY_SECOND_WORD,
      CHANGE_WORD_TO_SWAMP,
      UNDO_CHANGE_WORD_TO_SWAMP,
    ].includes(action.type) &&
    currentProject !== null
  ) {
    return {
      ...currentProject,
      transcription: transcriptionReducer(currentProject.transcription, action),
    };
  }

  return currentProject;
};

export default currentProjectReducer;
