// TODO: Define transcription schema (this is just a mockup)
export type Transcription = { words: [Word] };

export type Word = {
  word: string;
  start_time: number;
  duration: number;
};

export interface ProjectBase {
  schemaVersion: number;
  name: string;
  savePath: string;
  filePath: string;
  transcription: Transcription | null;
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
