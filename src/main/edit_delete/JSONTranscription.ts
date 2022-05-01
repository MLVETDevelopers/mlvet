import { Transcription, Word } from "sharedTypes";

export default class JSONTranscription implements Transcription {

  confidence: number;
  words: Word[];
  total_length: number;

  constructor(words: Word[], total_length: number, confidence: number) {
    this.words = words;
    this.total_length = total_length;
    this.confidence = confidence;
  }
}
