/**
 * formats a date as a dd/mm/yy string e.g. '14/03/22'
 */
export const formatDate: (date: Date) => string = (date) => {
  // dd/mm/yy
  const dd = date.getDate().toString(); // days start at 1
  const mm = (date.getMonth() + 1).toString(); // months start at 0 because JavaScript hates us
  const yy = (date.getFullYear() % 100).toString();

  const pad: (val: string) => string = (val) =>
    val.length === 1 ? `0${val}` : val;

  return [dd, mm, yy].map(pad).join('/');
};

/**
 * Dev helper for measuring and printing time taken by a function
 */
export function measureTimeTaken<T extends (...args: any) => any>(func: T) {
  const before = performance.now();
  const returnValue: ReturnType<T> = func();
  const after = performance.now();
  console.log(after - before);
  return returnValue;
}
