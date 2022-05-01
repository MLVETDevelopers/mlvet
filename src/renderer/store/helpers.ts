import { Project, RecentProject } from '../../sharedTypes';

export enum ApplicationPage {
  HOME = 'HOME',
  PROJECT = 'PROJECT',
}

export type Action<T> = {
  type: string;
  payload: T;
};

export interface ApplicationStore {
  currentProject: Project | null;
  recentProjects: RecentProject[];
  currentPage: ApplicationPage;
}

export const initialStore: ApplicationStore = {
  currentProject: null,
  recentProjects: [],
  currentPage: ApplicationPage.HOME,
};
