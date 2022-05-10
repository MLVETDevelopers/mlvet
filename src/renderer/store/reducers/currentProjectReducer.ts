import { Reducer } from 'redux';
import { Project, Transcription } from '../../../sharedTypes';
import {
  CURRENT_PROJECT_CLOSED,
  PROJECT_CREATED,
  PROJECT_OPENED,
  PROJECT_SAVED,
  TRANSCRIPTION_CREATED,
} from '../actions';
import { Action, ApplicationStore, initialStore } from '../helpers';
import {
  CHANGE_WORD_TO_SWAMP,
  DELETE_EVERY_SECOND_WORD,
  UNDO_CHANGE_WORD_TO_SWAMP,
  UNDO_DELETE_EVERY_SECOND_WORD,
} from '../ops';
import transcriptionReducer from './transcriptionReducer';

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
    const { projectId, filePath } = action.payload as {
      projectId: string;
      filePath: string;
    };

    return projectId === currentProject.id
      ? {
          ...currentProject,
          projectFilePath: filePath,
        }
      : currentProject;
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
