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

  key: string;

  constructor(
    key: string,
    word: string,
    startTime: number,
    duration: number,
    fileName: string
  ) {
    this.key = key;
    this.word = word;
    this.startTime = startTime;
    this.duration = duration;
    this.fileName = fileName;
    this.deleted = false;
  }
}
