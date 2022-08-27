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

/**
 * By default the Array.sort() function sorts alphabetically, e.g. 10 comes before 2.
 * This function properly sorts number arrays.
 * It mutates the input array.
 */
export const sortNumerical: (list: number[]) => void = (list) => {
  list.sort((first, second) => first - second);
};
