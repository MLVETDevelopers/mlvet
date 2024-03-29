import { createStore } from 'redux';
import { ProjectMetadata } from 'sharedTypes';
import { mockProject } from '../../../../../mocks/mocks';
import currentProjectReducer from '../reducer';
import {
  currentProjectClosed,
  projectCreated,
  projectSaved,
  projectOpened,
} from '../actions';

const store = createStore(currentProjectReducer);

describe('Current Project actions', () => {
  afterEach(() => {
    store.replaceReducer(currentProjectReducer);
  });

  it('closing initial state project', () => {
    store.dispatch(currentProjectClosed());
    expect(store.getState()).toEqual(null);
  });

  it('creating project', () => {
    store.dispatch(projectCreated(mockProject));
    expect(store.getState()).toEqual(mockProject);
  });

  it('saving project', () => {
    const newFilePath = 'test-new-file-path';
    store.dispatch(
      projectSaved(
        mockProject,
        { dateModified: new Date(), mediaSize: 0 },
        newFilePath
      )
    );
    expect(store.getState()).toEqual({
      ...mockProject,
      projectFilePath: newFilePath,
    });
  });

  it('opening project', () => {
    const openedProjectFilePath = 'test-opened-file-path';
    const projectMetadata: ProjectMetadata = {
      dateModified: null,
      mediaSize: null,
    };
    store.dispatch(
      projectOpened(mockProject, openedProjectFilePath, projectMetadata)
    );
    expect(store.getState()).toEqual({
      ...mockProject,
      projectFilePath: openedProjectFilePath,
    });
  });

  it('closing created project', () => {
    store.dispatch(projectCreated(mockProject));
    expect(store.getState()).toEqual(mockProject);

    store.dispatch(currentProjectClosed());
    expect(store.getState()).toEqual(null);
  });
});
