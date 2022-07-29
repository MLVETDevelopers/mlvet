import path from 'path';

type GetFileNameWithExtension = (filePath: string | null) => Promise<string>;

const getFileNameWithExtension: GetFileNameWithExtension = async (filePath) => {
  if (filePath === null) {
    return '';
  }
  return path.basename(filePath);
};

export default getFileNameWithExtension;
