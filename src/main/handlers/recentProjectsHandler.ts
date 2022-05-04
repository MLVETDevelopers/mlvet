import { app } from 'electron';
import path from 'path';
import fs from 'fs/promises';
import { Project } from '../../sharedTypes';
import { appDataStoragePath } from '../util';

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

export const readRecentProjects: () => Promise<Project[]> = async () => {
  try {
    const recentProjectsJson = (
      await fs.readFile(RECENT_PROJECTS_PATH)
    ).toString();
    const recentProjects = JSON.parse(recentProjectsJson);

    return recentProjects;
  } catch (err) {
    return [];
  }
};
