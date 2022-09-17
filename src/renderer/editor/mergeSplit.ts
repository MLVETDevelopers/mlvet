import { isMergeSplitAllowed } from 'renderer/store/selection/helpers';
import dispatchOp from 'renderer/store/dispatchOp';
import { makeMergeWords } from 'renderer/store/transcriptionWords/ops/mergeWords';
import { makeSplitWord } from 'renderer/store/transcriptionWords/ops/splitWord';
import { Word } from 'sharedTypes';
import store from '../store/store';

const getWords: () => Word[] = () => {
  return store.getState().currentProject?.transcription?.words ?? [];
};

export const mergeWords: () => void = () => {
  const words = getWords();
  const range = store.getState().selection.self;

  // sanity check
  if (!isMergeSplitAllowed(words, range).merge) {
    return;
  }

  dispatchOp(makeMergeWords(words, range));
};

export const splitWord: () => void = () => {
  const words = getWords();
  const range = store.getState().selection.self;

  // sanity check
  if (!isMergeSplitAllowed(words, range).split) {
    return;
  }

  dispatchOp(makeSplitWord(words, range.startIndex));
};
