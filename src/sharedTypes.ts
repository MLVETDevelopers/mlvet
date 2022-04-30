export interface ProjectBase {
  schemaVersion: number;
  name: string;
  filePath: string;
  transcription: Transcription | null;
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

export interface AudioProject extends ProjectBase {
  mediaType: 'audio';
  fileExtension: AudioFileExtension;
}

export interface VideoProject extends ProjectBase {
  mediaType: 'video';
  fileExtension: VideoFileExtension;
}

export type Project = AudioProject | VideoProject;
