import { Action } from '../action';

export const EDIT_WORD_INDEX_SET = 'EDIT_WORD_INDEX_SET';
export const EDIT_WORD_INDEX_CLEARED = 'EDIT_WORD_INDEX_CLEARED';

export const editWordIndexSet: (index: number) => Action<{
  index: number;
}> = (index) => ({
  type: EDIT_WORD_INDEX_SET,
  payload: { index },
});

export const editWordIndexCleared: () => Action<null> = () => ({
  type: EDIT_WORD_INDEX_CLEARED,
  payload: null,
});
