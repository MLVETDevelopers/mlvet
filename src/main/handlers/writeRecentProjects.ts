import fs from 'fs/promises';
import { RecentProject } from '../../sharedTypes';
import { getRecentProjectsPath } from '../util';

type WriteRecentProjects = (recentProjects: RecentProject[]) => Promise<void>;

const writeRecentProjects: WriteRecentProjects = async (recentProjects) => {
  const recentProjectsJson = JSON.stringify(recentProjects);

  await fs.writeFile(getRecentProjectsPath(), recentProjectsJson);
};

export default writeRecentProjects;
