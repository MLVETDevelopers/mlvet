import { Reducer } from 'redux';
import { makeRecentProject } from '../../../sharedUtils';
import {
  RuntimeProject,
  ProjectMetadata,
  RecentProject,
} from '../../../sharedTypes';
import {
  PROJECT_DELETED,
  RECENT_PROJECTS_LOADED,
  RECENT_PROJECT_ADDED,
} from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { Action } from '../action';
import { PROJECT_OPENED, PROJECT_SAVED } from '../currentProject/actions';

const recentProjectsReducer: Reducer<
  ApplicationStore['recentProjects'],
  Action<any>
> = (recentProjects = initialStore.recentProjects, action) => {
  if (action.type === RECENT_PROJECT_ADDED) {
    return [action.payload as RecentProject, ...recentProjects];
  }

  if (action.type === RECENT_PROJECTS_LOADED) {
    return action.payload as RecentProject[];
  }

  if (action.type === PROJECT_OPENED) {
    const {
      project: openedProject,
      filePath,
      metadata,
    } = action.payload as {
      project: RuntimeProject;
      filePath: string;
      metadata: ProjectMetadata;
    };

    // If the project has already been opened before, update the file path
    const recentProjectsUpdatedFilePath = recentProjects.map((recentProject) =>
      recentProject.id === openedProject.id
        ? { ...recentProject, projectFilePath: filePath }
        : recentProject
    );

    // If the project hasn't been opened before, add it to the recent projects
    const recentProjectsIncludingOpened = recentProjectsUpdatedFilePath.some(
      (recentProject) => recentProject.id === openedProject.id
    )
      ? recentProjectsUpdatedFilePath
      : recentProjectsUpdatedFilePath.concat([
          makeRecentProject(openedProject, metadata, filePath),
        ]);

    return recentProjectsIncludingOpened;
  }

  if (action.type === PROJECT_SAVED) {
    const { project, metadata, filePath } = action.payload as {
      project: RuntimeProject;
      metadata: ProjectMetadata;
      filePath: string;
    };

    const recentProject: RecentProject = makeRecentProject(
      project,
      metadata,
      filePath
    );

    // If this project is already saved in the recents, then skip saving
    if (
      recentProjects.some(
        (otherProject) => otherProject.id === recentProject.id
      )
    ) {
      return recentProjects;
    }

    // Append project to recent projects immutably
    return recentProjects.concat([recentProject]);
  }

  if (action.type === PROJECT_DELETED) {
    const { id } = action.payload as { id: string };

    return recentProjects.filter((recentProject) => recentProject.id !== id);
  }

  return recentProjects;
};

export default recentProjectsReducer;
