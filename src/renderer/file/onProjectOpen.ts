import ipc from 'renderer/ipc';
import { pageChanged } from 'renderer/store/currentPage/actions';
import { ApplicationPage } from 'renderer/store/currentPage/helpers';
import { projectOpened } from 'renderer/store/currentProject/actions';
import store from 'renderer/store/store';
import { RuntimeProject } from 'sharedTypes';

const onProjectOpen: (
  project: RuntimeProject,
  filePath: string
) => Promise<void> = async (project, filePath) => {
  if (await ipc.promptSave()) {
    const projectMetadata = await ipc.retrieveProjectMetadata(project);

    store.dispatch(projectOpened(project, filePath, projectMetadata));
    store.dispatch(pageChanged(ApplicationPage.PROJECT));
  }
};

export default onProjectOpen;
