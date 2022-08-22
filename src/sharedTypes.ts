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
  duration: number;
  outputDuration: number;
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
  pasteKey: number;
  // Used to differentiate between different projects/media;
  // TODO(chloe) this should be replaced with project ID or transcript ID
  // in order to support multiple projects without relying on a filename (which can change)
  fileName: string;
}

export interface Cut {
  startTime: number;
  duration: number;
  outputStartTime: number;
  // Somewhat redundant as cuts are stored in array, but it's used by the
  // video preview controller for O(1) lookups of the current cut index
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

// Interface for index ranges, usually start-inclusive and end-exclusive.
export interface IndexRange {
  startIndex: number;
  endIndex: number;
}

/** Utility types */

// Callback to be passed into a map function.
// First type argument is the input type, second is the output type
export type MapCallback<T, U> = (val: T, index: number, arr: T[]) => U;
