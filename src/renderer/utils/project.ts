import { v4 as uuidv4 } from 'uuid';
import {
  AudioFileExtension,
  RuntimeProject,
  VideoFileExtension,
} from 'sharedTypes';
import ipc from 'renderer/ipc';
import { extractFileExtension, getMediaType } from './file';
import { CURRENT_SCHEMA_VERSION } from '../../constants';

export const makeProject: (
  projectName: string,
  mediaFilePath: string | null
) => Promise<RuntimeProject | null> = async (projectName, mediaFilePath) => {
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

  const project: RuntimeProject = {
    id: uuidv4(),
    name: projectName,
    mediaType,
    mediaFileExtension: mediaFileExtension as
      | AudioFileExtension
      | VideoFileExtension,
    mediaFilePath,
    schemaVersion: CURRENT_SCHEMA_VERSION,
    transcription: null,
    projectFilePath: null,
    isEdited: false,
  };

  const thumbnailPath = await ipc.extractThumbnail(mediaFilePath, project);
  if (thumbnailPath === null) {
    return null;
  }

  return project;
};

export const makeProjectWithoutMedia: (
  projectName: string
) => Promise<RuntimeProject | null> = async (projectName) => {
  const project: RuntimeProject = {
    id: uuidv4(),
    name: projectName,
    schemaVersion: 0,
    projectFilePath: null,
    mediaFilePath: null,
    transcription: null,
    mediaType: 'video',
    mediaFileExtension: 'mp4',
    isEdited: false,
  };

  return project;
};

export const updateProjectWithMedia: (
  currentProject: RuntimeProject,
  mediaFilePath: string | null
) => Promise<RuntimeProject | null> = async (currentProject, mediaFilePath) => {
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

  const thumbnailPath = await ipc.extractThumbnail(
    mediaFilePath,
    currentProject
  );
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

  return currentProject;
};

export const updateProjectWithExtractedAudio: (
  currentProject: RuntimeProject,
  extractedAudioFilePath: string | null
) => Promise<RuntimeProject | null> = async (
  currentProject,
  extractedAudioFilePath
) => {
  if (extractedAudioFilePath === null) {
    return null;
  }

  return currentProject;
};
