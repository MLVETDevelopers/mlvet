// TODO: Define transcription schema (this is just a mockup)
export type Transcription = string;

export interface ProjectBase {
  name: string;
  filePath: string;
  transcription: Transcription | null;
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
