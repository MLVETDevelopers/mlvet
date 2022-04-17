import { Project } from '../../sharedTypes';

export interface ApplicationStore {
  currentProject: Project | null;
  recentProjects: Project[];
}

export const initialStore: ApplicationStore = {
  currentProject: null,
  recentProjects: [
    {
      name: 'First Project',
      mediaType: 'video',
      filePath: 'fakepath',
      fileExtension: 'mp4',
      transcription: null,
    },
    {
      name: 'Second Project',
      mediaType: 'video',
      filePath: 'fakepath',
      fileExtension: 'mp4',
      transcription: null,
    },
    {
      name: 'Third Project',
      mediaType: 'video',
      filePath: 'fakepath',
      fileExtension: 'mp4',
      transcription: null,
    },
    {
      name: 'Fourth Project',
      mediaType: 'video',
      filePath: 'fakepath',
      fileExtension: 'mp4',
      transcription: null,
    },
    {
      name: 'Fifth Project',
      mediaType: 'video',
      filePath: 'fakepath',
      fileExtension: 'mp4',
      transcription: null,
    },
    {
      name: 'Sixth Project',
      mediaType: 'video',
      filePath: 'fakepath',
      fileExtension: 'mp4',
      transcription: null,
    },
  ],
};
