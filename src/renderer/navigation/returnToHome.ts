import { collabSessionEnded } from 'renderer/store/collab/actions';
import { pageChanged } from 'renderer/store/currentPage/actions';
import { ApplicationPage } from 'renderer/store/currentPage/helpers';
import {
  currentProjectClosed,
  projectSaved,
} from 'renderer/store/currentProject/actions';
import store from 'renderer/store/store';

const returnToHome: () => Promise<void> = async () => {
  const { currentProject } = store.getState();
  const saveChanges = 0;
  const cancel = 2;

  if (currentProject === null) return;

  const userSelection = await window.electron.returnToHome(currentProject);

  // if user cancels
  if (userSelection === cancel) return;

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

  const { collab } = store.getState();

  if (collab !== null) {
    collab.collabClient.closeSocket();
    store.dispatch(collabSessionEnded());
  }
};

export default returnToHome;
