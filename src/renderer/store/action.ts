export type Action<T> = {
  type: string;
  payload: T;
};
