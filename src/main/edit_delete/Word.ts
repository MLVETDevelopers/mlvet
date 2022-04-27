export default class Word {
  /**
   * Represents a word in a transcription
   */
  startTime: number;

  duration: number;

  fileName: string;

  deleted: boolean;

  constructor(startTime: number, duration: number, fileName: string) {
    this.startTime = startTime;
    this.duration = duration;
    this.fileName = fileName;
    this.deleted = false;
  }
}
