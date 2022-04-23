import {
  Project,
  AudioFileExtension,
  VideoFileExtension,
} from './store/helpers';

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

export const getMediaType: (extension: string) => 'audio' | 'video' | null = (
  extension
) => {
  const audioFileExtensions = ['mp3'];
  const videoFileExtensions = ['mp4'];

  if (audioFileExtensions.includes(extension)) {
    return 'audio';
  }
  if (videoFileExtensions.includes(extension)) {
    return 'video';
  }

  return null;
};

export const makeProject: (
  projectName: string,
  mediaFilePath: string | null
) => Project | null = (projectName, mediaFilePath) => {
  if (mediaFilePath === null) {
    return null;
  }

  const fileExtension = extractFileExtension(mediaFilePath);
  if (fileExtension === null) {
    return null;
  }

  const mediaType = getMediaType(fileExtension);
  if (mediaType === null) {
    return null;
  }

  const project: Project =
    mediaType === 'audio'
      ? {
          name: projectName,
          mediaType: 'audio',
          fileExtension: fileExtension as AudioFileExtension,
          filePath: mediaFilePath,
        }
      : {
          name: projectName,
          mediaType: 'video',
          fileExtension: fileExtension as VideoFileExtension,
          filePath: mediaFilePath,
        };

  return project;
};
