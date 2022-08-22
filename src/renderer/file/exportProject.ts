import ipc from 'renderer/ipc';
import { startExport } from 'renderer/store/exportIo/actions';
import store from 'renderer/store/store';

/**
 * Used by backend to initiate export from front end
 */
const exportProject: () => Promise<void> = async () => {
  // Retrieve current project state from redux
  const { currentProject } = store.getState();

  // Don't export if we don't have a project open
  if (currentProject === null) return;

  const filePath = await ipc.exportProject(currentProject);

  store.dispatch(startExport(currentProject.id, filePath));
};

export default exportProject;
