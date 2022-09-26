import ipc from 'renderer/ipc';
import store from 'renderer/store/store';
import { ExportFormat } from '../../sharedTypes';

/**
 * Used by backend to initiate export from front end
 */
const exportProject: (exportFormat: ExportFormat) => Promise<void> = async (
  exportFormat
) => {
  // Retrieve current project state from redux
  const { currentProject } = store.getState();

  // Don't export if we don't have a project open
  if (currentProject === null) return;

  try {
    await ipc.exportProject(exportFormat, currentProject);
  } catch (err) {
    console.error(err);
  }
};

export default exportProject;
