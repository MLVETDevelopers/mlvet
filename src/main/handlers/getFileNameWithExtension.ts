import path from 'path';

export const getFileNameWithExtension: (filePath: string | null) => string = (
  filePath
) => {
  if (filePath === null) {
    return '';
  }
  return path.basename(filePath);
};

export default getFileNameWithExtension;
