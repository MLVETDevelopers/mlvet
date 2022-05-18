import path from 'path';

type GetFileNameWithExtension = (filePath: string | null) => string;

const getFileNameWithExtension: GetFileNameWithExtension = (filePath) => {
  if (filePath === null) {
    return '';
  }
  return path.basename(filePath);
};

export default getFileNameWithExtension;
