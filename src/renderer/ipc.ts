import { Project } from '../sharedTypes';
import {
  projectOpened,
  pageChanged,
  updateExportProgress,
  finishExport,
} from './store/actions';
import { ApplicationPage } from './store/helpers';
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
window.electron.on('finish-export', async (_event) => {
  store.dispatch(finishExport());
});
