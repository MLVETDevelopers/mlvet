import { Reducer } from 'redux';
import { Project, Transcription } from 'sharedTypes';
import {
  CURRENT_PROJECT_CLOSED,
  PROJECT_CREATED,
  PROJECT_OPENED,
  TRANSCRIPTION_CREATED,
} from '../actions';
import { Action, ApplicationStore, initialStore } from '../helpers';
import transcriptionReducer from './transcriptionReducer';

const currentProjectReducer: Reducer<
  ApplicationStore['currentProject'],
  Action<any>
> = (currentProject = initialStore.currentProject, action) => {
  if (action.type === PROJECT_CREATED || action.type === PROJECT_OPENED) {
    return action.payload as Project;
  }

  if (action.type === CURRENT_PROJECT_CLOSED) {
    return null;
  }

  // Delegate transcription-related actions to transcription reducer
  if (action.type === TRANSCRIPTION_CREATED && currentProject !== null) {
    return {
      ...currentProject,
      transcription: transcriptionReducer(currentProject.transcription, action),
    };
  }

  return currentProject;
};

export default currentProjectReducer;
