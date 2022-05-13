import { v4 as uuidv4 } from 'uuid';
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

  const mediaFileExtension = extractFileExtension(mediaFilePath);
  if (mediaFileExtension === null) {
    return null;
  }

  const mediaType = getMediaType(mediaFileExtension);
  if (mediaType === null) {
    return null;
  }

  const thumbnailPath = await extractThumbnail(mediaFilePath);
  if (thumbnailPath === null) {
    return null;
  }

  const project: Project = {
    id: uuidv4(),
    name: projectName,
    mediaType,
    mediaFileExtension: mediaFileExtension as
      | AudioFileExtension
      | VideoFileExtension,
    mediaFilePath,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    transcription: null,
    thumbnailFilePath: thumbnailPath,
    projectFilePath: null,
    exportFilePath: null,
  };

  return project;
};

export const makeProjectWithoutMedia: (
  projectName: string
) => Promise<Project | null> = async (projectName) => {
  const project: Project = {
    id: uuidv4(),
    name: projectName,
    schemaVersion: 0,
    projectFilePath: null,
    exportFilePath: null,
    mediaFilePath: null,
    transcription: null,
    mediaType: 'audio',
    mediaFileExtension: 'mp3',
    thumbnailFilePath: null,
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
  currentProject.mediaFileExtension = fileExtension as
    | AudioFileExtension
    | VideoFileExtension;
  currentProject.mediaFilePath = mediaFilePath;
  currentProject.schemaVersion = CURRENT_SCHEMA_VERSION;
  currentProject.transcription = null;
  currentProject.thumbnailFilePath = thumbnailPath;

  return currentProject;
};

export const formatDate: (date: Date) => string = (date) => {
  // dd/mm/yy
  const dd = date.getDate().toString(); // days start at 1
  const mm = (date.getMonth() + 1).toString(); // months start at 0 because JavaScript hates us
  const yy = (date.getFullYear() % 100).toString();

  const pad: (val: string) => string = (val) =>
    val.length === 1 ? `0${val}` : val;

  return [dd, mm, yy].map(pad).join('/');
};
