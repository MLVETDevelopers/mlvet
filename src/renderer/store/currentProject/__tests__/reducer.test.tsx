import { Project } from 'sharedTypes';
import currentPageReducer from '../reducer';
import {
  CURRENT_PROJECT_CLOSED,
  PROJECT_CREATED,
  PROJECT_OPENED,
  PROJECT_SAVED,
} from '../actions';

const mockProject: Project = {
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

describe('Current Project reducer', () => {
  it('should handle current project closed', () => {
    expect(
      currentPageReducer(mockProject, {
        type: CURRENT_PROJECT_CLOSED,
        payload: null,
      })
    ).toEqual(null);
  });

  it('should handle project created', () => {
    expect(
      currentPageReducer(null, {
        type: PROJECT_CREATED,
        payload: mockProject,
      })
    ).toEqual(mockProject);
  });

  it('should handle project saved', () => {
    expect(
      currentPageReducer(mockProject, {
        type: PROJECT_SAVED,
        payload: 'test-new-file-path',
      })
    ).toEqual({ ...mockProject, projectFilePath: 'test-new-file-path' });
  });

  it('should handle project opened', () => {
    expect(
      currentPageReducer(null, {
        type: PROJECT_OPENED,
        payload: { project: mockProject, filePath: 'test-new-file-path' },
      })
    ).toEqual({ ...mockProject, projectFilePath: 'test-new-file-path' });
  });
});
