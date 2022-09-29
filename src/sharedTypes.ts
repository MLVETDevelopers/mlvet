import { ClientId } from 'collabTypes/collabShadowTypes';

// Transcription chunks are either a take group or a paragraph of words
export type TranscriptionChunk = TakeGroup | Word[];

export interface SelectionState {
  self: IndexRange;
  others: Record<ClientId, IndexRange>;
}

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
  words: Word[];
  duration: number;
  outputDuration: number;
  takeGroups: TakeGroup[];
}

export type PartialWord = Pick<
  Word,
  'word' | 'startTime' | 'duration' | 'confidence'
>;

export interface TakeGroup {
  // each time a new take group is created we find the highest take group ID in use and add one
  id: number;
  activeTakeIndex: number;
  takeSelected: boolean;
}

export interface TakeInfo {
  takeGroupId: number;
  takeIndex: number;
}

export enum TranscriptionEngine {
  DUMMY = 'DUMMY',
  ASSEMBLYAI = 'ASSEMBLYAI',
  VOSK = 'VOSK',
}

export type EngineConfig = string | null | CloudConfig | LocalConfig;

export interface CloudConfig {
  key: string | null;
}

export interface LocalConfig {
  assetPath: string | null;
}

export interface TranscriptionConfig {
  defaultEngine: TranscriptionEngine | null;
  ASSEMBLYAI: CloudConfig;
  VOSK: LocalConfig;
  DUMMY: EngineConfig;
}

export interface Word {
  // Text content of the word - null if it's just a "pause"
  word: string | null;
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
  // Stores information related to take detection and manipulation
  takeInfo: TakeInfo | null;
  // Now that we have assemblyAI, we can do this - individual confidence for each word.
  // Ranges from 0 - 1.
  // if using another platform that doesn't support this, just set to null.
  confidence: number | null | undefined;
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

export enum ExportFormat {
  EDL = 'edl',
  MP4 = 'mp4',
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
