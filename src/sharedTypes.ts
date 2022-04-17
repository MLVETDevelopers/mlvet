// TODO: Define transcription schema (this is just a mockup)
export type Transcription = string;

export interface Project {
  name: string;
  mediaType: 'audio' | 'video';
  filePath: string;
  fileExtension: 'wav' | 'mp4';
  transcription: Transcription | null;
}
