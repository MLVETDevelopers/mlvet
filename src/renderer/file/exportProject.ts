import ipc from 'renderer/ipc';
import store from 'renderer/store/store';
import { ExportFormat, RuntimeProject } from '../../sharedTypes';
import saveProject from './saveProject';

/**
 * Used by backend to initiate export from front end
 */
const exportProject: (exportFormat: ExportFormat) => Promise<void> = async (
  exportFormat
) => {
  // Retrieve current project state from redux
  let { currentProject } = store.getState();

  // Don't export if we don't have a project open
  if (currentProject === null) return;

  if (currentProject.projectFilePath === null) {
    try {
      await saveProject(false);
      currentProject = store.getState().currentProject as RuntimeProject;
    } catch (err) {
      console.error(err);
    }
  }

  try {
    await ipc.exportProject(exportFormat, currentProject);
  } catch (err) {
    console.error(err);
  }
};

export default exportProject;
