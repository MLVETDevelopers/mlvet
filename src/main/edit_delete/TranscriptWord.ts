import { Word } from 'sharedTypes';

export default class TranscriptWord implements Word {
  /**
   * Represents a word in a transcription
   */

  word: string;

  startTime: number;

  duration: number;

  fileName: string;

  deleted: boolean;

  constructor(
    word: string,
    startTime: number,
    duration: number,
    fileName: string
  ) {
    this.word = word;
    this.startTime = startTime;
    this.duration = duration;
    this.fileName = fileName;
    this.deleted = false;
  }
}
