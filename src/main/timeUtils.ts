export const padZeros: (num: number, len: number) => string = (num, len) => {
  return String(num).padStart(len, '0');
};

export const integerDivide: (a: number, b: number) => number = (a, b) => {
  return Math.floor(a / b);
};

// 00:00:00:00
export const secondToTimestamp: (num: number) => string = (num) => {
  return [3600, 60, 1, 0.01]
    .map((mult) => padZeros(integerDivide(num, mult), 2))
    .join(':');
};
