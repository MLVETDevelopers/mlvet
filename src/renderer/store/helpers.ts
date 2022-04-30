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

const baseMockProject: Project = {
  schemaVersion: 1,
  mediaType: 'video',
  filePath: 'fakepath',
  fileExtension: 'mp4',
  transcription: {
    confidence: 1,
    words: [
      {
        word: 'yo',
        start_time: 0,
        duration: 1,
      },
      {
        word: 'great job',
        start_time: 1,
        duration: 1,
      },
    ],
  },
  name: 'name',
};

export const initialStore: ApplicationStore = {
  currentProject: baseMockProject,
  recentProjects: ['First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth'].map(
    (name) => ({ ...baseMockProject, name: `${name} Project` } as VideoProject)
  ),
  currentPage: ApplicationPage.PROJECT, // Changed from home page to increase load speed
};
