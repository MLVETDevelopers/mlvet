declare module '@ffprobe-installer/ffprobe';

export interface SnakeCaseWord {
  word: string;
  duration: number;
  start_time: number; // TODO: change this to camel case before it touches TS
}

export interface JSONTranscription {
  confidence: number;
  words: SnakeCaseWord[];
}
