import path from 'path';
import fs from 'fs/promises';
import { Project, RecentProject } from '../../sharedTypes';
import { appDataStoragePath } from '../util';
import retrieveMetadata from './projectMetadataHandler';
import makeRecentProject from '../../sharedUtils';

const RECENT_PROJECTS_PATH = path.join(
  appDataStoragePath(),
  'recentProjects.json'
);

export const writeRecentProjects: (
  recentProjects: RecentProject[]
) => Promise<void> = async (recentProjects) => {
  const recentProjectsJson = JSON.stringify(recentProjects);

  await fs.writeFile(RECENT_PROJECTS_PATH, recentProjectsJson);
};

/**
 * Type for project persisted to disk in the recent projects list -
 * includes the intersection of project and recent project fields (i.e. no metadata
 * as this can go stale)
 */
type PersistedRecentProject = Pick<Project, keyof (Project | RecentProject)>;

export const readRecentProjects: () => Promise<RecentProject[]> = async () => {
  try {
    const recentProjectsJson = (
      await fs.readFile(RECENT_PROJECTS_PATH)
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
    return [];
  }
};
