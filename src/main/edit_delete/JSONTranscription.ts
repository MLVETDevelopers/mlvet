import { Transcription, Word } from 'sharedTypes';

export default class JSONTranscription implements Transcription {
  confidence: number;

  words: Word[];

  constructor(words: Word[], confidence: number) {
    this.words = words;
    this.confidence = confidence;
  }
}
