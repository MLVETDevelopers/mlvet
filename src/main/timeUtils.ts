export const padZeros: (num: number, len: number) => string = (num, len) => {
  return String(num).padStart(len, '0');
};

export const integerDivide: (a: number, b: number) => number = (a, b) => {
  return Math.floor(a / b);
};

// 00:00:00:00
export const secondToEDLTimestamp: (num: number, fps: number) => string = (
  num,
  fps
) => {
  if (num < 0) {
    throw new Error('Negative Input');
  }
  const edlFps = Math.max(fps, 30);

  const date = new Date(num * 1000);

  /**
   * For the frame gap problem, making timestamps round down 1 frame while having the
   * input duration round 1 up frame fills in microgaps cleanly.
   */
  const frame = Math.floor((edlFps * date.getMilliseconds()) / 1000);

  const timestamp = `${padZeros(date.getUTCHours(), 2)}:${padZeros(
    date.getMinutes(),
    2
  )}:${padZeros(date.getSeconds(), 2)}:`;
  return timestamp.concat(padZeros(frame, 2));
};

export const secondToTimestampUI = (
  time: number,
  showMilliseconds = true
): string => {
  const pad = (n: number) => padZeros(n, 2);

  let timeRemaining = time;
  const timeHours = integerDivide(timeRemaining, 3600);
  timeRemaining %= 3600;

  const timeMins = integerDivide(timeRemaining, 60);
  timeRemaining %= 60;

  const timeSeconds = Math.floor(timeRemaining);
  timeRemaining -= timeSeconds;

  const timeMilliSeconds = Math.round(timeRemaining * 100);

  let formattedTime = `${pad(timeHours)}:${pad(timeMins)}:${pad(timeSeconds)}`;
  if (showMilliseconds) formattedTime += `.${pad(timeMilliSeconds)}`;

  // Include hours if video is larger than 1 hr
  return timeHours > 0 ? formattedTime : formattedTime.substring(3);
};

export const clamp = (num: number, min = 0, max = 1) => {
  const newVal = Math.max(min, num);
  return Math.min(max, newVal);
};
