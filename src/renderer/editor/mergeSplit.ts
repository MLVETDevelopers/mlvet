import { dispatchOp } from 'renderer/store/undoStack/opHelpers';
import { makeMergeWords, makeSplitWord } from 'renderer/store/undoStack/ops';
import { Word } from 'sharedTypes';
import store from '../store/store';
import { getSelectionRanges } from './selection';

const getWords: () => Word[] | null = () => {
  const { currentProject } = store.getState();

  if (currentProject === null) {
    return null;
  }

  const { transcription } = currentProject;
  if (transcription === null) {
    return null;
  }

  const { words } = transcription;

  return words;
};

export const mergeWords: () => void = () => {
  const ranges = getSelectionRanges();

  // Ensure a continuous range selected
  if (ranges.length !== 1) {
    return;
  }

  const words = getWords();
  if (words === null) {
    return;
  }

  dispatchOp(makeMergeWords(words, ranges[0]));
};

export const splitWord: () => void = () => {
  const words = getWords();
  if (words === null) {
    return;
  }

  const ranges = getSelectionRanges();

  // Ensure a single word selected
  if (
    !(ranges.length === 1 && ranges[0].endIndex - ranges[0].startIndex === 1)
  ) {
    return;
  }

  dispatchOp(makeSplitWord(words, ranges[0].startIndex));
};
