import { IndexRange, MapCallback } from 'sharedTypes';

/**
 * Maps the values of a list using a given map function,
 * but only for those values within specified ranges.
 * Values outside of the given indices will be unaltered.
 * @returns the mapped list
 */
export const mapInRanges: <T>(
  list: T[],
  mapCallback: MapCallback<T, T>,
  ranges: IndexRange[]
) => T[] = (list, mapCallback, ranges) => {
  const listNew = [...list];

  ranges.forEach((range) => {
    const { startIndex, endIndex } = range;
    for (let i = startIndex; i < endIndex; i += 1) {
      listNew[i] = mapCallback(list[i], i, list);
    }
  });

  return listNew;
};

/**
 * By default the Array.sort() function sorts alphabetically, e.g. 10 comes before 2.
 * This function properly sorts number arrays.
 * It mutates the input array.
 */
export const sortNumerical: (list: number[]) => void = (list) => {
  list.sort((first, second) => first - second);
};

/**
 * Similar to the array .map() function but allows an accumulated value to be passed
 * between item callbacks
 */
export const mapWithAccumulator: <T, U>(
  list: T[],
  mapAccumulatorCallback: (
    item: T,
    index: number,
    acc: U
  ) => { item: any; acc: U },
  accInitialValue: U
) => any[] = (list, mapAccumulatorCallback, accInitialValue) => {
  const data = {
    list: [...list],
    acc: accInitialValue,
  };

  list.reduce((accData, curr, index) => {
    const { list: newList, acc } = accData;
    const { item, acc: newAcc } = mapAccumulatorCallback(curr, index, acc);

    newList[index] = item;

    return {
      list: newList,
      acc: newAcc,
    };
  }, data);

  return data.list;
};
