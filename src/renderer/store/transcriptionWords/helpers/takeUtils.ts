import { TakeInfo, Word } from '../../../../sharedTypes';

type GetNewTakeInfo = (tf: TakeInfo | null, word: Word) => TakeInfo | null;

// eslint-disable-next-line import/prefer-default-export
export const getNewTakeInfo: GetNewTakeInfo = (tf, word) => {
  if (word.takeInfo !== null) return word.takeInfo;
  return tf;
};
