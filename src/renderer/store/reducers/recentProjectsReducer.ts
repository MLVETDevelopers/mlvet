import { Reducer } from 'redux';
import { makeRecentProject } from '../../util';
import { Project, ProjectMetadata, RecentProject } from '../../../sharedTypes';
import {
  PROJECT_OPENED,
  PROJECT_SAVED_FIRST_TIME,
  RECENT_PROJECTS_LOADED,
  RECENT_PROJECT_ADDED,
} from '../actions';
import { Action, ApplicationStore, initialStore } from '../helpers';

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
    const { project: openedProject, filePath } = action.payload as {
      project: Project;
      filePath: string;
    };

    return recentProjects.map((project) =>
      project.id === openedProject.id
        ? { ...project, projectFilePath: filePath }
        : project
    );
  }

  if (action.type === PROJECT_SAVED_FIRST_TIME) {
    const { project, metadata, filePath } = action.payload as {
      project: Project;
      metadata: ProjectMetadata;
      filePath: string;
    };

    const recentProject: RecentProject = makeRecentProject(
      project,
      metadata,
      filePath
    );

    // Append project to recent projects immutably
    return recentProjects.concat([recentProject]);
  }

  return recentProjects;
};

export default recentProjectsReducer;
