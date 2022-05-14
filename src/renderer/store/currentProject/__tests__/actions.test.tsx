import { createStore } from 'redux';
import { mockProject } from '../../../../../mocks/mocks';
import currentPageReducer from '../reducer';
import {
  currentProjectClosed,
  projectCreated,
  projectSaved,
  projectOpened,
} from '../actions';

const store = createStore(currentPageReducer);

describe('Current Project actions', () => {
  afterEach(() => {
    store.replaceReducer(currentPageReducer);
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
    store.dispatch(projectSaved('test-id', newFilePath));
    expect(store.getState()).toEqual({
      ...mockProject,
      projectFilePath: newFilePath,
    });
  });

  it('opening project', () => {
    const openedProjectFilePath = 'test-opened-file-path';
    store.dispatch(projectOpened(mockProject, openedProjectFilePath));
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
