import fs from 'fs/promises';
import { ProjectIdAndFilePath } from '../../../sharedTypes';
import { fileOrDirExists, getProjectDataDir } from '../../util';

const deleteFileOrDir: (filePath: string) => Promise<void> = async (
  filePath
) => {
  try {
    await fs.rm(filePath, { recursive: true });
  } catch (err) {
    // eslint-disable-next-line no-useless-return
    return;
  }
};

type DeleteProject = (project: ProjectIdAndFilePath) => Promise<void>;

/**
 * Note: does NOT delete associated media file.
 * @param project project to delete
 */
const deleteProject: DeleteProject = async (project) => {
  // TODO(chloe): Delete project associated thumbnail file
  // Skipped for now, because the thumbnail is in a fixed location

  // Delete project metadata from disk if it exists
  if (fileOrDirExists(getProjectDataDir(project.id))) {
    await deleteFileOrDir(getProjectDataDir(project.id));
  }

  // Delete project file from disk if it exists
  if (
    project.projectFilePath !== null &&
    fileOrDirExists(project.projectFilePath)
  ) {
    await deleteFileOrDir(project.projectFilePath);
  }
};

export default deleteProject;
