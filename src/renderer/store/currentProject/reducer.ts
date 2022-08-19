import { Reducer } from 'redux';
import { RuntimeProject, ProjectMetadata } from '../../../sharedTypes';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';
import {
  CURRENT_PROJECT_CLOSED,
  PROJECT_CREATED,
  PROJECT_OPENED,
  PROJECT_SAVED,
} from './actions';
import transcriptionReducer from '../transcription/reducer';
import {
  DELETE_SELECTION,
  PASTE_WORD,
  TRANSCRIPTION_CREATED,
  UNDO_DELETE_SELECTION,
  UNDO_PASTE_WORD,
  MERGE_WORDS,
  UNDO_MERGE_WORDS,
  SPLIT_WORD,
  UNDO_SPLIT_WORD,
} from '../transcription/actions';
import {
  EXPORT_PROGRESS_UPDATE,
  START_EXPORT,
  FINISH_EXPORT,
} from '../exportIo/actions';

const currentProjectReducer: Reducer<
  ApplicationStore['currentProject'],
  Action<any>
> = (currentProject = initialStore.currentProject, action) => {
  if (action.type === PROJECT_CREATED) {
    return action.payload as RuntimeProject;
  }

  if (action.type === PROJECT_OPENED) {
    return {
      ...(action.payload.project as RuntimeProject),
      isEdited: false,
      projectFilePath: action.payload.filePath,
    };
  }

  if (action.type === PROJECT_SAVED && currentProject !== null) {
    const { project, filePath } = action.payload as {
      project: RuntimeProject;
      metadata: ProjectMetadata;
      filePath: string;
    };

    return project.id === currentProject.id
      ? {
          ...currentProject,
          isEdited: false,
          projectFilePath: filePath,
        }
      : currentProject;
  }

  if (action.type === CURRENT_PROJECT_CLOSED) {
    return null;
  }

  if (action.type === START_EXPORT && currentProject !== null) {
    return {
      ...currentProject,
      exportFilePath: action.payload.exportFilePath,
    };
  }

  if (action.type === EXPORT_PROGRESS_UPDATE && currentProject !== null) {
    return {
      ...currentProject,
      progress: action.payload.progress,
    };
  }

  if (action.type === FINISH_EXPORT) {
    return {
      ...(action.payload.project as RuntimeProject),
      projectFilePath: action.payload.filePath,
    };
  }

  // Delegate transcription-related actions to transcription reducer
  if (
    [
      TRANSCRIPTION_CREATED,
      DELETE_SELECTION,
      UNDO_DELETE_SELECTION,
      PASTE_WORD,
      UNDO_PASTE_WORD,
      MERGE_WORDS,
      UNDO_MERGE_WORDS,
      SPLIT_WORD,
      UNDO_SPLIT_WORD,
    ].includes(action.type) &&
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
