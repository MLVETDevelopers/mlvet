import fs from 'fs/promises';
import { Project, RecentProject } from '../../../sharedTypes';
import retrieveMetadata from './projectMetadataHandler';
import { makeRecentProject } from '../../../sharedUtils';
import { getRecentProjectsPath } from '../../util';

/**
 * Type for project persisted to disk in the recent projects list -
 * includes the intersection of project and recent project fields (i.e. no metadata
 * as this can go stale)
 */
type PersistedRecentProject = Pick<Project, keyof (Project | RecentProject)>;

type ReadRecentProjects = () => Promise<RecentProject[]>;

const readRecentProjects: ReadRecentProjects = async () => {
  try {
    const recentProjectsJson = (
      await fs.readFile(getRecentProjectsPath())
    ).toString();
    const recentProjects = JSON.parse(recentProjectsJson);

    // Read metadata
    const recentProjectsWithMetadata = await Promise.all(
      recentProjects
        .filter(
          (project: PersistedRecentProject) => project.projectFilePath !== null
        )
        .map(async (project: PersistedRecentProject) =>
          makeRecentProject(
            project,
            await retrieveMetadata(project),
            project.projectFilePath as string
          )
        )
    );

    return recentProjectsWithMetadata;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export default readRecentProjects;
