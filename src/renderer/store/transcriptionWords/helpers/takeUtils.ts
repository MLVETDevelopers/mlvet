import { TakeInfo, Word } from '../../../../sharedTypes';

type GetNewTakeInfo = (tf: TakeInfo | null, word: Word) => TakeInfo | null;

/*
 * Returns the first takeInfo that is not null, from the list of words
 */
// eslint-disable-next-line import/prefer-default-export
export const getWordsTakeInfo: GetNewTakeInfo = (tf, word) => {
  if (word.takeInfo !== null) return word.takeInfo;
  return tf;
};
