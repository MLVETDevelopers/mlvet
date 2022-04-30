import { Project } from '../sharedTypes';
import { projectOpened, pageChanged } from './store/actions';
import { ApplicationPage } from './store/helpers';
import { dispatchRedo, dispatchUndo } from './store/opHelpers';
import store from './store/store';

/**
 * Used by backend to initiate saves from front end
 */
window.electron.on('initiate-save-project', async () => {
  // Retrieve current project state from redux
  const { currentProject } = store.getState();

  // Don't save if we don't have a project open
  if (currentProject === null) return;

  await window.electron.saveProject(currentProject);
});

/**
 * Used by backend to notify front end that a project was opened
 */
window.electron.on('project-opened', async (_event, project: Project) => {
  store.dispatch(projectOpened(project));
  store.dispatch(pageChanged(ApplicationPage.PROJECT));
});

/**
 * Used by backend to initiate undo from edit menu
 */
window.electron.on('initiate-undo', async () => {
  dispatchUndo(store.dispatch, store.getState().undoStack);
});

/**
 * Used by backend to initiate redo from edit menu
 */
window.electron.on('initiate-redo', async () => {
  dispatchRedo(store.dispatch, store.getState().undoStack);
});
