export interface Project {
  schemaVersion: number;
  name: string;
  savePath: string;
  filePath: string;
  transcription: Transcription | null;
  mediaType: 'audio' | 'video';
  fileExtension: AudioFileExtension | VideoFileExtension;
}

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
}

export interface Clip {
  startTime: number;
  duration: number;
  fileName: string;
}

export type AudioFileExtension = 'mp3';
export type VideoFileExtension = 'mp4';

export type MediaFileExtension = AudioFileExtension | VideoFileExtension;
