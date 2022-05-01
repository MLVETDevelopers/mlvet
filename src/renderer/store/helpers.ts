import { Project } from '../../sharedTypes';

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
  recentProjects: Project[];
  currentPage: ApplicationPage;
}

export const initialStore: ApplicationStore = {
  currentProject: null,
  recentProjects: [],
  currentPage: ApplicationPage.HOME,
};
