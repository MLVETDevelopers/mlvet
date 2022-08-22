import { isMergeSplitAllowed } from 'renderer/store/selection/helpers';
import dispatchOp from 'renderer/store/dispatchOp';
import {
  makeMergeWords,
  makeSplitWord,
} from 'renderer/store/transcriptionWords/ops';
import { Word } from 'sharedTypes';
import store from '../store/store';
import { getSelectionRanges } from './selection';

const getWords: () => Word[] = () => {
  return store.getState().currentProject?.transcription?.words ?? [];
};

export const mergeWords: () => void = () => {
  const words = getWords();
  const ranges = getSelectionRanges();

  // sanity check
  if (!isMergeSplitAllowed(words, ranges).merge) {
    return;
  }

  dispatchOp(makeMergeWords(words, ranges[0]));
};

export const splitWord: () => void = () => {
  const words = getWords();
  const ranges = getSelectionRanges();

  // sanity check
  if (!isMergeSplitAllowed(words, ranges).split) {
    return;
  }

  dispatchOp(makeSplitWord(words, ranges[0].startIndex));
};
