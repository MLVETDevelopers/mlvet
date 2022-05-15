import { Project } from '../sharedTypes';
import ipc from './ipc';
import { projectOpened, projectSaved } from './store/currentProject/actions';
import { pageChanged } from './store/currentPage/actions';
import { updateExportProgress, finishExport } from './store/exportIo/actions';
import { ApplicationPage } from './store/currentPage/helpers';
import { dispatchRedo, dispatchUndo } from './store/undoStack/opHelpers';
import store from './store/store';

/**
 * Used by backend to initiate saves from front end
 */
ipc.on('initiate-save-project', async () => {
  // Retrieve current project state from redux
  const { currentProject } = store.getState();

  // Don't save if we don't have a project open
  if (currentProject === null) return;

  const filePath = await ipc.saveProject(currentProject);

  store.dispatch(projectSaved(currentProject.id, filePath));
});

/**
 * Used by backend to notify front end that a project was opened
 */
ipc.on('project-opened', async (_event, project: Project, filePath: string) => {
  store.dispatch(projectOpened(project, filePath));
  store.dispatch(pageChanged(ApplicationPage.PROJECT));
});

/**

 * Used by backend to update frontend on export progress
 */
ipc.on('export-progress-update', async (_event, progress: number) => {
  store.dispatch(updateExportProgress(progress));
});

/**
 * Used by backend to notify frontend that export is complete
 */
ipc.on('finish-export', async () => {
  store.dispatch(finishExport());
});

/*
 * Used by backend to initiate undo from edit menu
 */
ipc.on('initiate-undo', async () => {
  dispatchUndo();
});

/**
 * Used by backend to initiate redo from edit menu
 */
ipc.on('initiate-redo', async () => {
  dispatchRedo();
});
