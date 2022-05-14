import fs from 'fs/promises';
import { RecentProject } from '../../sharedTypes';
import { RECENT_PROJECTS_PATH } from '../util';

type WriteRecentProjects = (recentProjects: RecentProject[]) => Promise<void>;

const writeRecentProjects: WriteRecentProjects = async (recentProjects) => {
  const recentProjectsJson = JSON.stringify(recentProjects);

  await fs.writeFile(RECENT_PROJECTS_PATH, recentProjectsJson);
};

export default writeRecentProjects;
