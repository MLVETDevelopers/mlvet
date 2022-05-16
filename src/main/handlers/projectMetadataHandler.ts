import fs from 'fs/promises';
import { Project, ProjectMetadata } from '../../sharedTypes';

const retrieveDateModified: (filePath: string) => Promise<Date | null> = async (
  filePath
) => {
  try {
    const fileStats = await fs.stat(filePath);

    return fileStats.mtime;
  } catch (err) {
    return null;
  }
};

const retrieveSize: (filePath: string) => Promise<number | null> = async (
  filePath
) => {
  try {
    const fileStats = await fs.stat(filePath);

    return fileStats.size;
  } catch (err) {
    return null;
  }
};

type RetrieveProjectMetadata = (
  project: Pick<Project, 'projectFilePath' | 'mediaFilePath'>
) => Promise<ProjectMetadata>;

const retrieveProjectMetadata: RetrieveProjectMetadata = async (project) => {
  const projectLastModified =
    project.projectFilePath === null
      ? null
      : await retrieveDateModified(project.projectFilePath);

  const mediaSize =
    project.mediaFilePath === null
      ? null
      : await retrieveSize(project.mediaFilePath);

  return {
    dateModified: projectLastModified,
    mediaSize,
  };
};

export default retrieveProjectMetadata;
