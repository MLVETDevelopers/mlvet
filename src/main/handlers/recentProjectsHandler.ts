import path from 'path';
import fs from 'fs/promises';
import { Project, RecentProject } from '../../sharedTypes';
import { appDataStoragePath } from '../util';
import retrieveMetadata from './projectMetadataHandler';

const RECENT_PROJECTS_PATH = path.join(
  appDataStoragePath(),
  'recentProjects.json'
);

export const writeRecentProjects: (
  recentProjects: Project[]
) => Promise<void> = async (recentProjects) => {
  const recentProjectsJson = JSON.stringify(recentProjects);

  await fs.writeFile(RECENT_PROJECTS_PATH, recentProjectsJson);
};

export const readRecentProjects: () => Promise<RecentProject[]> = async () => {
  try {
    const recentProjectsJson = (
      await fs.readFile(RECENT_PROJECTS_PATH)
    ).toString();
    const recentProjects = JSON.parse(recentProjectsJson);

    // Read metadata
    const recentProjectsWithMetadata = await Promise.all(
      recentProjects.map(async (project: Project) => ({
        ...project,
        ...(await retrieveMetadata(project)),
      }))
    );

    return recentProjectsWithMetadata;
  } catch (err) {
    return [];
  }
};
