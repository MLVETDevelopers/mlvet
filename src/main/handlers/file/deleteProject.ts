import fs from 'fs/promises';
import { Project } from '../../../sharedTypes';

const deleteFileIfExists: (filePath: string) => Promise<void> = async (
  filePath
) => {
  try {
    await fs.rm(filePath);
  } catch (err) {
    // eslint-disable-next-line no-useless-return
    return;
  }
};

type DeleteProject = (project: Project) => Promise<void>;

/**
 * Note: does NOT delete associated media file.
 * @param project project to delete
 */
const deleteProject: DeleteProject = async (project) => {
  // TODO(chloe): Delete project associated thumbnail file
  // Skipped for now, because the thumbnail is in a fixed location

  // Delete audio extract from disk if it exists
  if (project.audioExtractFilePath !== null) {
    await deleteFileIfExists(project.audioExtractFilePath);
  }

  // Delete project file from disk if it exists
  if (project.projectFilePath !== null) {
    await deleteFileIfExists(project.projectFilePath);
  }
};

export default deleteProject;
