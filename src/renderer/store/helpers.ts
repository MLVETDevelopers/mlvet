export interface Project {
  name: string;
  mediaType: 'audio' | 'video';
  filePath: string;
  fileExtension: 'wav' | 'mp4';
}

export interface ApplicationStore {
  currentProject: Project | null | undefined;
  recentProjects: Project[] | undefined;
}

export const initialStore: ApplicationStore = {
  currentProject: null,
  recentProjects: [
    {
      name: 'First Project',
      mediaType: 'video',
      filePath: 'fakepath',
      fileExtension: 'mp4',
    },
    {
      name: 'Second Project',
      mediaType: 'video',
      filePath: 'fakepath',
      fileExtension: 'mp4',
    },
    {
      name: 'Third Project',
      mediaType: 'video',
      filePath: 'fakepath',
      fileExtension: 'mp4',
    },
    {
      name: 'Fourth Project',
      mediaType: 'video',
      filePath: 'fakepath',
      fileExtension: 'mp4',
    },
    {
      name: 'Fifth Project',
      mediaType: 'video',
      filePath: 'fakepath',
      fileExtension: 'mp4',
    },
    {
      name: 'Sixth Project',
      mediaType: 'video',
      filePath: 'fakepath',
      fileExtension: 'mp4',
    },
  ],
};
