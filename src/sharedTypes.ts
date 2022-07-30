export interface Project {
  id: string; // UUID
  schemaVersion: number;
  name: string;
  projectFilePath: string | null;
  exportFilePath: string | null;
  audioExtractFilePath: string | null;
  mediaFilePath: string | null;
  transcription: Transcription | null;
  mediaType: 'audio' | 'video';
  mediaFileExtension: AudioFileExtension | VideoFileExtension;
  thumbnailFilePath: string | null;
  isEdited: boolean;
}

export interface ProjectMetadata {
  dateModified: Date | null;
  mediaSize: number | null; // bytes
}

export type RecentProject = Pick<
  Project,
  'id' | 'name' | 'projectFilePath' | 'mediaFilePath' | 'thumbnailFilePath'
> &
  ProjectMetadata;

export type AudioFileExtension = 'mp3';
export type VideoFileExtension = 'mp4';

export interface Transcription {
  confidence: number;
  words: Word[];
  duration: number;
}

export interface Word {
  // Text content of the word
  word: string;
  // Start time in the original transcript
  startTime: number;
  // Duration in the original transcript
  duration: number;
  // Start time for the actual playback, updated each time an edit is made
  outputStartTime: number;
  // Duration in seconds of any space before the word that we are counting as part of the word
  bufferDurationBefore: number;
  // Duration in seconds of any space after the word that we are counting as part of the word
  bufferDurationAfter: number;
  // Whether the word is marked as deleted
  deleted: boolean;
  // The position of the word in the original transcript
  originalIndex: number;
  // Zero if the word is in its original position;
  // higher if it has been pasted one or more times.
  // Used in combination with the originalIndex to produce a unique key
  pasteCount: number;
  // Used to differentiate between different projects/media;
  // TODO(chloe) this should be replaced with project ID or transcript ID
  // in order to support multiple projects without relying on a filename (which can change)
  fileName: string;
}

export interface Cut {
  startTime: number;
  duration: number;
  outputStartTime: number;
  index: number; // TODO(chloe): do we need this? it's implied by the array form
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

/** Utility types */

// Callback to be passed into a map function.
// First type argument is the input type, second is the output type
export type MapCallback<T, U> = (val: T, index: number, arr: T[]) => U;
