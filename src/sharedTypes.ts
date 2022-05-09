export interface Project {
  id: string; // UUID
  schemaVersion: number;
  name: string;
  projectFilePath: string | null;
  exportFilePath: string | null;
  mediaFilePath: string | null;
  transcription: Transcription | null;
  mediaType: 'audio' | 'video';
  mediaFileExtension: AudioFileExtension | VideoFileExtension;
  thumbnailFilePath: string | null;
}

export interface ProjectMetadata {
  dateModified: Date | null;
  mediaSize: number | null; // bytes
}

export type RecentProject = Project & ProjectMetadata;

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
  deleted: boolean;
  key: string;
  fileName: string;
}

export interface Clip {
  startTime: number;
  duration: number;
  fileName: string;
}

export interface Cut {
  startTime: number;
  duration: number;
}

export type MediaFileExtension = AudioFileExtension | VideoFileExtension;

export enum OperatingSystems {
  MACOS = 'darwin',
  WINDOWS = 'win32',
  LINUX = 'linux',
}
