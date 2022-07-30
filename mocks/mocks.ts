import { Project } from '../src/sharedTypes';

/* eslint-disable import/prefer-default-export */
export const mockProject: Project = {
  id: 'test-id',
  schemaVersion: 123456789,
  name: 'test-name',
  projectFilePath: 'test-project-file-path',
  exportFilePath: 'test-export-file-path',
  audioExtractFilePath: 'test-audio-file-path',
  mediaFilePath: 'test-media-file-path',
  isEdited: false,
  transcription: {
    confidence: 123456789,
    duration: 100,
    words: [
      {
        word: 'test-word-1',
        startTime: 0,
        duration: 5,
        outputStartTime: 1,
        deleted: true,
        originalIndex: 0,
        pasteCount: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        fileName: 'test-file-name',
      },
    ],
  },
  mediaType: 'video',
  mediaFileExtension: 'mp4',
  thumbnailFilePath: 'test-thumbnail-file-path',
};
