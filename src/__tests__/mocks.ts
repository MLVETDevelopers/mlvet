import { Project } from 'sharedTypes';

/* eslint-disable import/prefer-default-export */
export const mockProject: Project = {
  id: 'test-id',
  schemaVersion: 123456789,
  name: 'test-name',
  projectFilePath: 'test-project-file-path',
  exportFilePath: 'test-export-file-path',
  mediaFilePath: 'test-media-file-path',
  transcription: {
    confidence: 123456789,
    words: [
      {
        word: 'test-word-1',
        startTime: 0,
        duration: 5,
        outputStartTime: 1,
        deleted: true,
        key: 'test-word-key-1',
        fileName: 'test-file-name',
      },
    ],
  },
  mediaType: 'video',
  mediaFileExtension: 'mp4',
  thumbnailFilePath: 'test-thumbnail-file-path',
};
