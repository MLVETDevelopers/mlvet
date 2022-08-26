import ipc from 'renderer/ipc';
import { projectSaved } from 'renderer/store/currentProject/actions';
import store from 'renderer/store/store';

const saveProject: (shouldCloseAfter: boolean) => Promise<void> = async (
  shouldCloseAfter
) => {
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
};

export default saveProject;
