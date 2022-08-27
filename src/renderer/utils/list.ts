/* eslint-disable import/prefer-default-export */

/**
 * By default the Array.sort() function sorts alphabetically, e.g. 10 comes before 2.
 * This function properly sorts number arrays.
 * It mutates the input array.
 */
export const sortNumerical: (list: number[]) => void = (list) => {
  list.sort((first, second) => first - second);
};
