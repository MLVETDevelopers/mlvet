interface ProjectBase {
  name: string;
  filePath: string;
}

export type AudioFileExtension = 'mp3';
export type VideoFileExtension = 'mp4';

export type MediaFileExtension = AudioFileExtension | VideoFileExtension;

interface AudioProject extends ProjectBase {
  mediaType: 'audio';
  fileExtension: AudioFileExtension;
}

interface VideoProject extends ProjectBase {
  mediaType: 'video';
  fileExtension: VideoFileExtension;
}

export type Project = AudioProject | VideoProject;

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
