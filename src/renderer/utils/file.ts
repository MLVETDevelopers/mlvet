/**
 * Extracts file extension from a file path
 */
export const extractFileExtension: (filePath: string) => string | null = (
  filePath
) => {
  const filePathSplit = filePath.split('.');
  const extension = filePathSplit[filePathSplit.length - 1];
  if (extension === '') {
    return null;
  }
  return extension;
};

/**
 * Determines media type from a file extension
 */
export const getMediaType: (extension: string) => 'audio' | 'video' | null = (
  extension
) => {
  const audioFileExtensions = ['mp3', 'mpeg'];
  const videoFileExtensions = ['mp4'];

  if (audioFileExtensions.includes(extension)) {
    return 'audio';
  }
  if (videoFileExtensions.includes(extension)) {
    return 'video';
  }

  return null;
};

/**
 * Takes a filename with extension and returns the filename without its extension
 */
export const removeExtension: (fileName: string) => string = (fileName) => {
  const split = fileName.split('.');
  return split.slice(0, split.length - 1).join('.');
};
