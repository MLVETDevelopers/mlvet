import { Reducer } from 'redux';
import { Project } from '../../../sharedTypes';
import {
  CURRENT_PROJECT_CLOSED,
  PROJECT_CREATED,
  PROJECT_OPENED,
  PROJECT_SAVED,
  TRANSCRIPTION_CREATED,
} from '../actions';
import { Action, ApplicationStore, initialStore } from '../helpers';
import { DELETE_WORD, UNDO_DELETE_WORD } from '../ops';
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
      isEdited: false,
      projectFilePath: action.payload.filePath,
    };
  }

  if (action.type === PROJECT_SAVED && currentProject !== null) {
    const { filePath } = action.payload as {
      projectId: string;
      filePath: string;
    };

    return {
      ...currentProject,
      isEdited: false,
      projectFilePath: filePath,
    };
  }

  if (action.type === CURRENT_PROJECT_CLOSED) {
    return null;
  }

  // Delegate transcription-related actions to transcription reducer
  if (
    [TRANSCRIPTION_CREATED, DELETE_WORD, UNDO_DELETE_WORD].includes(
      action.type
    ) &&
    currentProject !== null
  ) {
    return {
      ...currentProject,
      isEdited: true,
      transcription: transcriptionReducer(currentProject.transcription, action),
    };
  }

  return currentProject;
};

export default currentProjectReducer;
