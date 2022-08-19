import { v4 as uuidv4 } from 'uuid';
import { RuntimeProject } from '../sharedTypes';
import ipc from './ipc';
import {
  currentProjectClosed,
  projectOpened,
  projectSaved,
} from './store/currentProject/actions';
import { pageChanged } from './store/currentPage/actions';
import {
  updateExportProgress,
  finishExport,
  startExport,
} from './store/exportIo/actions';
import { ApplicationPage } from './store/currentPage/helpers';
import { dispatchRedo, dispatchUndo } from './store/undoStack/opHelpers';
import store from './store/store';
import { removeExtension } from './util';
import { copyText, cutText, deleteText, pasteText } from './editor/clipboard';
import { selectAllWords } from './editor/selection';

/**
 * Used by backend to initiate saves from front end
 */
ipc.on('initiate-save-project', async (_event, shouldCloseAfter: boolean) => {
  // Retrieve current project state from redux
  const { currentProject } = store.getState();

  // Don't save if we don't have a project open
  if (currentProject === null) return;

  const filePath = await ipc.saveProject(currentProject);

  const projectMetadata = await window.electron.retrieveProjectMetadata({
    ...currentProject,
    projectFilePath: filePath,
  });

  ipc.setFileRepresentation(filePath, false);

  store.dispatch(projectSaved(currentProject, projectMetadata, filePath));

  if (shouldCloseAfter) {
    ipc.closeWindow();
  }
});

/**
 * Used by backend to initiate save-as from front end
 */
ipc.on('initiate-save-as-project', async () => {
  // Retrieve current project state from redux
  const { currentProject } = store.getState();

  // Don't save-as if we don't have a project open or if the project doesn't have an existing save path
  if (currentProject === null || currentProject.projectFilePath === null)
    return;

  // Generate a deep-copy of the project, with new ID and name
  const newProject = JSON.parse(
    JSON.stringify(currentProject)
  ) as RuntimeProject;
  newProject.name = `Copy of ${currentProject.name}`;
  newProject.id = uuidv4();

  // TODO(chloe): regenerate thumbnail and audio extract

  const filePath = await ipc.saveAsProject(newProject);

  const savedFileNameWithExtension = await ipc.getFileNameWithExtension(
    filePath
  );

  const savedFileName = removeExtension(savedFileNameWithExtension);

  // Update the saved file name to the name that it was actually saved as, rather than the default 'Copy of ...'
  newProject.name = savedFileName;

  // Add to recent projects
  const projectMetadata = await ipc.retrieveProjectMetadata({
    ...currentProject,
    projectFilePath: filePath,
  });

  store.dispatch(projectSaved(newProject, projectMetadata, filePath));
  store.dispatch(projectOpened(newProject, filePath, projectMetadata));

  ipc.setFileRepresentation(filePath, false);
});

/**
 * Used by backend to notify front end that a project was opened
 */
ipc.on(
  'project-opened',
  async (_event, project: RuntimeProject, filePath: string) => {
    if (await ipc.promptSave()) {
      const projectMetadata = await ipc.retrieveProjectMetadata(project);

      store.dispatch(projectOpened(project, filePath, projectMetadata));
      store.dispatch(pageChanged(ApplicationPage.PROJECT));
    }
  }
);

/**

 * Used by backend to update frontend on export progress
 */
ipc.on('export-progress-update', async (_event, progress: number) => {
  store.dispatch(updateExportProgress(progress));
});

/**
 * Used by backend to notify frontend that export is complete
 */
ipc.on(
  'finish-export',
  async (_event, project: RuntimeProject, filePath: string) => {
    store.dispatch(finishExport(project, filePath));
    store.dispatch(pageChanged(ApplicationPage.PROJECT));
  }
);

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

/**
 * Used by backend to initiate export from front end
 */
ipc.on('initiate-export-project', async () => {
  // Retrieve current project state from redux
  const { currentProject } = store.getState();

  // Don't export if we don't have a project open
  if (currentProject === null) return;

  const filePath = await ipc.exportProject(currentProject);

  store.dispatch(startExport(currentProject.id, filePath));
});

const EDITOR_ACTIONS: Record<string, () => void> = {
  'initiate-cut-text': cutText,
  'initiate-copy-text': copyText,
  'initiate-paste-text': pasteText,
  'initiate-delete-text': deleteText,
  'initiate-select-all': selectAllWords,
};

// Register the editor actions as IPC receivers
Object.keys(EDITOR_ACTIONS).forEach((key) => {
  ipc.on(key, async () => {
    EDITOR_ACTIONS[key]();
  });
});

/**
 * Used by backend to initiate return to home from front end
 */
window.electron.on('initiate-return-to-home', async () => {
  const { currentProject } = store.getState();
  const saveChanges = 0;

  if (currentProject === null) return;

  const userSelection = await window.electron.returnToHome(currentProject);

  // if user wants to save unsaved changes
  if (userSelection === saveChanges) {
    const filePath = await window.electron.saveProject(currentProject);

    const projectMetadata = await window.electron.retrieveProjectMetadata({
      ...currentProject,
      projectFilePath: filePath,
    });

    store.dispatch(projectSaved(currentProject, projectMetadata, filePath));
  }
  store.dispatch(pageChanged(ApplicationPage.HOME));
  store.dispatch(currentProjectClosed());
});
