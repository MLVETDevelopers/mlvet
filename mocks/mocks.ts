import { RuntimeProject } from '../src/sharedTypes';

/* eslint-disable import/prefer-default-export */
export const mockProject: RuntimeProject = {
  id: 'test-id',
  schemaVersion: 123456789,
  name: 'test-name',
  projectFilePath: 'test-project-file-path',
  mediaFilePath: 'test-media-file-path',
  isEdited: false,
  transcription: {
    duration: 100,
    outputDuration: 100,
    takeGroups: [],
    words: [
      {
        word: 'test-word-1',
        startTime: 0,
        duration: 5,
        outputStartTime: 1,
        deleted: true,
        originalIndex: 0,
        pasteKey: 0,
        bufferDurationBefore: 0,
        bufferDurationAfter: 0,
        fileName: 'test-file-name',
        takeInfo: null,
        confidence: 1,
      },
    ],
  },
  mediaType: 'video',
  mediaFileExtension: 'mp4',
};
