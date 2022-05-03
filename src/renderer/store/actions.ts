import { Project, ProjectName, Transcription } from '../../sharedTypes';
import { Action, ApplicationPage, Op } from './helpers';
import { DoPayload, UndoPayload } from './opPayloads';

export const PROJECT_CREATED = 'PROJECT_CREATED';
export const PROJECT_OPENED = 'PROJECT_OPENED';
export const PROJECT_NAME_SUBMITTED = 'PROJECT_NAME_SUBMITTED';
export const CURRENT_PROJECT_CLOSED = 'CURRENT_PROJECT_CLOSED';
export const RECENT_PROJECT_ADDED = 'RECENT_PROJECT_ADDED';
export const TRANSCRIPTION_CREATED = 'TRANSCRIPTION_CREATED';
export const PAGE_CHANGED = 'PAGE_CHANGED';

export const UNDO_STACK_PUSHED = 'UNDO_STACK_PUSHED';
export const UNDO_STACK_POPPED = 'UNDO_STACK_POPPED';
export const OP_REDONE = 'OP_REDONE';

export const projectCreated: (project: Project) => Action<Project> = (
  project
) => ({
  type: PROJECT_CREATED,
  payload: project,
});

export const projectOpened: (project: Project) => Action<Project> = (
  project
) => ({
  type: PROJECT_OPENED,
  payload: project,
});

export const currentProjectClosed: () => Action<null> = () => ({
  type: CURRENT_PROJECT_CLOSED,
  payload: null,
});

export const recentProjectAdded: (project: Project) => Action<Project> = (
  project
) => ({
  type: RECENT_PROJECT_ADDED,
  payload: project,
});

export const transcriptionCreated: (
  transcription: Transcription
) => Action<Transcription> = (transcription) => ({
  type: TRANSCRIPTION_CREATED,
  payload: transcription,
});

export const pageChanged: (page: ApplicationPage) => Action<ApplicationPage> = (
  page
) => ({
  type: PAGE_CHANGED,
  payload: page,
});

export const undoStackPushed: <T extends DoPayload, U extends UndoPayload>(
  op: Op<T, U>
) => Action<Op<T, U>> = (undoAction) => ({
  type: UNDO_STACK_PUSHED,
  payload: undoAction,
});

export const undoStackPopped: () => Action<null> = () => ({
  type: UNDO_STACK_POPPED,
  payload: null,
});

export const opRedone: () => Action<null> = () => ({
  type: OP_REDONE,
  payload: null,
});

export const projectNameSubmitted: (
  projectName: ProjectName
) => Action<ProjectName> = (projectName) => ({
  type: PROJECT_CREATED,
  payload: projectName,
});
