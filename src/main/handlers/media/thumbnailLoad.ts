import fs from 'fs/promises';
import { getThumbnailPath } from '../../util';

/**
 * Loads a thumbnail as a base64 image.
 * Other alternatives are to use the express server to pass it as a blob
 */

type LoadThumbnail = (projectId: string) => Promise<string>;

const loadThumbnail: LoadThumbnail = async (projectId) => {
  const thumbnailPath = getThumbnailPath(projectId);

  const data = await fs.readFile(thumbnailPath, { encoding: 'base64' });

  return data;
};

export default loadThumbnail;
