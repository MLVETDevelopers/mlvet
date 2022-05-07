import { Project } from '../sharedTypes';
import {
  projectOpened,
  pageChanged,
  projectSaved,
  updateExportProgress,
  finishExport,
} from './store/actions';
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

  const filePath = await window.electron.saveProject(currentProject);

  store.dispatch(projectSaved(currentProject.id, filePath));
});

/**
 * Used by backend to notify front end that a project was opened
 */
window.electron.on(
  'project-opened',
  async (_event, project: Project, filePath: string) => {
    store.dispatch(projectOpened(project, filePath));
    store.dispatch(pageChanged(ApplicationPage.PROJECT));
  }
);

/**

 * Used by backend to update frontend on export progress
 */
window.electron.on(
  'export-progress-update',
  async (_event, progress: number) => {
    store.dispatch(updateExportProgress(progress));
  }
);

/**
 * Used by backend to notify frontend that export is complete
 */
window.electron.on('finish-export', async () => {
  store.dispatch(finishExport());
});

/*
 * Used by backend to initiate undo from edit menu
 */
window.electron.on('initiate-undo', async () => {
  dispatchUndo();
});

/**
 * Used by backend to initiate redo from edit menu
 */
window.electron.on('initiate-redo', async () => {
  dispatchRedo();
});
