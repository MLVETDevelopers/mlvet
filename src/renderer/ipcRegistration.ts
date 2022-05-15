import { v4 as uuidv4 } from 'uuid';
import { Project } from '../sharedTypes';
import ipc from './ipc';
import {
  projectOpened,
  pageChanged,
  projectSaved,
  updateExportProgress,
  finishExport,
  projectSavedFirstTime,
} from './store/actions';
import { ApplicationPage } from './store/helpers';
import { dispatchRedo, dispatchUndo } from './store/opHelpers';
import store from './store/store';
import { removeExtension } from './util';

/**
 * Used by backend to initiate saves from front end
 */
ipc.on('initiate-save-project', async () => {
  // Retrieve current project state from redux
  const { currentProject } = store.getState();

  // Don't save if we don't have a project open
  if (currentProject === null) return;

  const filePath = await window.electron.saveProject(currentProject);

  // Add to recent projects if project was saved for the first time
  if (filePath !== currentProject.projectFilePath) {
    const projectMetadata = await window.electron.retrieveProjectMetadata({
      ...currentProject,
      projectFilePath: filePath,
    });

    store.dispatch(
      projectSavedFirstTime(currentProject, projectMetadata, filePath)
    );
  }

  store.dispatch(projectSaved(currentProject.id, filePath));
});

/**
 * Used by backend to initiate save-as from front end
 */
window.electron.on('initiate-save-as-project', async () => {
  // Retrieve current project state from redux
  const { currentProject } = store.getState();

  // Don't save-as if we don't have a project open or if the project doesn't have an existing save path
  if (currentProject === null || currentProject.projectFilePath === null)
    return;

  // Generate a deep-copy of the project, with new ID and name
  const newProject = JSON.parse(JSON.stringify(currentProject)) as Project;
  newProject.name = `Copy of ${currentProject.name}`;
  newProject.id = uuidv4();

  // TODO(patrick): regenerate thumbnail and audio extract

  const filePath = await window.electron.saveAsProject(newProject);

  const savedFileNameWithExtension = await ipc.getFileNameWithExtension(
    filePath
  );

  const savedFileName = removeExtension(savedFileNameWithExtension);

  // Update the saved file name to the name that it was actually saved as, rather than the default 'Copy of ...'
  newProject.name = savedFileName;

  // Add to recent projects
  const projectMetadata = await window.electron.retrieveProjectMetadata({
    ...currentProject,
    projectFilePath: filePath,
  });

  store.dispatch(projectSavedFirstTime(newProject, projectMetadata, filePath));
  store.dispatch(projectOpened(newProject, filePath));
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
