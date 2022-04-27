export default class Clip {
  /**
   * Represents a clip of a video file
   */
  startTime: number;

  duration: number;

  fileName: string;

  constructor(startTime: number, duration: number, fileName: string) {
    this.startTime = startTime;
    this.duration = duration;
    this.fileName = fileName;
  }
}
