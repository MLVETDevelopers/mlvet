import currentPageReducer from '../reducer';
import {
  CURRENT_PROJECT_CLOSED,
  PROJECT_CREATED,
  PROJECT_OPENED,
  PROJECT_SAVED,
} from '../actions';
import { mockProject } from '../../../../../mocks/mocks';

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
    const newFilePath = 'test-new-file-path';
    expect(
      currentPageReducer(mockProject, {
        type: PROJECT_SAVED,
        payload: { id: 'test-id', filePath: newFilePath },
      })
    ).toEqual({ ...mockProject, projectFilePath: newFilePath });
  });

  it('should handle project opened', () => {
    const newFilePath = 'test-new-file-path';
    expect(
      currentPageReducer(null, {
        type: PROJECT_OPENED,
        payload: { project: mockProject, filePath: newFilePath },
      })
    ).toEqual({ ...mockProject, projectFilePath: newFilePath });
  });
});
