export interface Project {
  schemaVersion: number;
  name: string;
  savePath: string;
  filePath: string;
  transcription: Transcription | null;
  mediaType: 'audio' | 'video';
  fileExtension: AudioFileExtension | VideoFileExtension;
  thumbnailPath: string | null;
}

export interface Transcription {
  confidence: number;
  words: Word[];
}

export interface Word {
  word: string;
  startTime: number;
  duration: number;
}

export type AudioFileExtension = 'mp3';
export type VideoFileExtension = 'mp4';

export type MediaFileExtension = AudioFileExtension | VideoFileExtension;
