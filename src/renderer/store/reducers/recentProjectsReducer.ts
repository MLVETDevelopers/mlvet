import { Reducer } from 'redux';
import { Project, RecentProject } from '../../../sharedTypes';
import {
  PROJECT_OPENED,
  PROJECT_SAVED,
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

  if (action.type === PROJECT_SAVED) {
    const { projectId, filePath } = action.payload as {
      projectId: string;
      filePath: string;
    };

    return recentProjects.map((project) =>
      project.id === projectId
        ? { ...project, projectFilePath: filePath }
        : project
    );
  }

  return recentProjects;
};

export default recentProjectsReducer;
