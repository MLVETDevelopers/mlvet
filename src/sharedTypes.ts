export interface PersistedProject {
  id: string; // UUID
  schemaVersion: number;
  name: string;
  transcription: Transcription | null;
  mediaType: 'audio' | 'video';
  mediaFileExtension: AudioFileExtension | VideoFileExtension;
  mediaFilePath: string | null;
}

export interface RuntimeProject extends PersistedProject {
  projectFilePath: string | null;
  isEdited: boolean;
}

export type ProjectIdAndFilePath = Pick<
  RuntimeProject,
  'id' | 'projectFilePath'
>;

export interface ProjectMetadata {
  dateModified: Date | null;
  mediaSize: number | null; // bytes
}

export type RecentProject = Pick<
  RuntimeProject,
  'id' | 'name' | 'projectFilePath' | 'mediaFilePath'
> &
  ProjectMetadata;

export type AudioFileExtension = 'mp3';
export type VideoFileExtension = 'mp4';

export interface Transcription {
  confidence: number;
  words: Word[];
}

export interface Word {
  word: string;
  startTime: number;
  duration: number;
  outputStartTime: number;
  deleted: boolean;
  key: string;
  fileName: string;
}

export interface Cut {
  startTime: number;
  duration: number;
  outputStartTime: number;
  index: number;
}

export type MediaFileExtension = AudioFileExtension | VideoFileExtension;

export enum OperatingSystems {
  MACOS = 'darwin',
  WINDOWS = 'win32',
  LINUX = 'linux',
}

export enum AsyncState {
  READY = 'READY',
  LOADING = 'LOADING',
  DONE = 'DONE',
  ERROR = 'ERROR',
}
