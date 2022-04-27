export default class Transcription {
  total_length: number;

  confidence: number;

  constructor(total_length: number, confidence: number) {
    this.total_length = total_length;
    this.confidence = confidence;
  }
}
