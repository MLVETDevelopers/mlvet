import { Reducer } from 'redux';
import { Project, ProjectMetadata } from '../../../sharedTypes';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';
import {
  CURRENT_PROJECT_CLOSED,
  PROJECT_CREATED,
  PROJECT_OPENED,
  PROJECT_SAVED,
} from './actions';
import transcriptionReducer from '../transcription/reducer';
import { TRANSCRIPTION_CREATED } from '../transcription/actions';
import {
  EXPORT_PROGRESS_UPDATE,
  START_EXPORT,
  FINISH_EXPORT,
} from '../exportIo/actions';
import { DELETE_WORD, UNDO_DELETE_WORD } from '../undoStack/ops';

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
    const { project, filePath } = action.payload as {
      project: Project;
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
