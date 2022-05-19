export const padZeros: (num: number, len: number) => string = (num, len) => {
  return String(num).padStart(len, '0');
};

export const integerDivide: (a: number, b: number) => number = (a, b) => {
  return Math.floor(a / b);
};

// 00:00:00:00
export const secondToTimestamp: (num: number) => string = (num) => {
  return new Date(num * 1000).toISOString().slice(11, 22).replace('.', ':');
};

export const secondToTimestampUI = (time: number): string => {
  const pad = (n: number) => padZeros(n, 2);

  let timeRemaining = time;
  const timeHours = integerDivide(timeRemaining, 3600);
  timeRemaining %= 3600;

  const timeMins = integerDivide(timeRemaining, 60);
  timeRemaining %= 60;

  const timeSeconds = Math.floor(timeRemaining);
  timeRemaining -= timeSeconds;

  const timeMilliSeconds = Math.round(timeRemaining * 100);

  const formattedTime = `${pad(timeHours)}:${pad(timeMins)}:${pad(
    timeSeconds
  )}.${pad(timeMilliSeconds)}`;

  // Include hours if video is larger than 1 hr
  return timeHours > 0 ? formattedTime : formattedTime.substring(3);
};

export const clamp = (num: number, min = 0, max = 1) => {
  const newVal = Math.max(min, num);
  return Math.min(max, newVal);
};
