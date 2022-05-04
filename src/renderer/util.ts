import { CURRENT_SCHEMA_VERSION } from '../constants';
import {
  AudioFileExtension,
  Project,
  VideoFileExtension,
} from '../sharedTypes';

const { extractThumbnail } = window.electron;

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

export const extractFileNameWithExtension: (
  filePath: string
) => Promise<string | null> = async (filePath) => {
  const filePathSplit = filePath.split('/');
  const fileNameWithExtension = filePathSplit[filePathSplit.length - 1];
  console.log(filePathSplit);
  console.log(fileNameWithExtension);

  return fileNameWithExtension;
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
) => Promise<Project | null> = async (projectName, mediaFilePath) => {
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

  const thumbnailPath = await extractThumbnail(mediaFilePath);
  if (thumbnailPath === null) {
    return null;
  }

  const project: Project = {
    name: projectName,
    mediaType,
    fileExtension: fileExtension as AudioFileExtension | VideoFileExtension,
    filePath: mediaFilePath,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    transcription: null,
    thumbnailPath,
  };

  return project;
};

export const makeProjectWithoutMedia: (
  projectName: string
) => Promise<Project | null> = async (projectName) => {
  const project: Project = {
    name: projectName,
  };

  return project;
};

export const updateProjectWithMedia: (
  currentProject: Project,
  mediaFilePath: string | null
) => Promise<Project | null> = async (currentProject, mediaFilePath) => {
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

  const thumbnailPath = await extractThumbnail(mediaFilePath);
  if (thumbnailPath === null) {
    return null;
  }

  currentProject.mediaType = mediaType;
  currentProject.fileExtension = fileExtension as
    | AudioFileExtension
    | VideoFileExtension;
  currentProject.filePath = mediaFilePath;
  currentProject.schemaVersion = CURRENT_SCHEMA_VERSION;
  currentProject.transcription = null;
  currentProject.thumbnailPath = thumbnailPath;

  return currentProject;
};
