export interface Project {
  schemaVersion: number;
  name: string;
  filePath: string;
  transcription: Transcription | null;
  mediaType: 'audio' | 'video';
  fileExtension: AudioFileExtension | VideoFileExtension;
}

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
}
