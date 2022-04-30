import { Project, VideoProject } from '../../sharedTypes';

export enum ApplicationPage {
  HOME = 'HOME',
  PROJECT = 'PROJECT',
}

export interface ApplicationStore {
  currentProject: Project | null;
  recentProjects: Project[];
  currentPage: ApplicationPage;
}

const baseMockProject: Omit<Project, 'name'> = {
  schemaVersion: 1,
  mediaType: 'video',
  filePath: 'fakepath',
  fileExtension: 'mp4',
  transcription: null,
};

export const initialStore: ApplicationStore = {
  currentProject: null,
  recentProjects: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'].map(
    (name) => ({ ...baseMockProject, name: `${name} Project` } as VideoProject)
  ),
  currentPage: ApplicationPage.HOME,
};
