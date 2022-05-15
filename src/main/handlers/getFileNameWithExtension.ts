import path from 'path';

export const getFileNameWithExtension: (
  filePath: string | null
) => Promise<string> = async (filePath) => {
  if (filePath === null) {
    return '';
  }
  return path.basename(filePath);
};

export default getFileNameWithExtension;
