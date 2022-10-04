import { excludeDeletedWords } from 'renderer/utils/range';
import { IndexRange, Word } from '../../sharedTypes';
import { clipboardUpdated } from '../store/clipboard/actions';
import store from '../store/store';
import dispatchOp from '../store/dispatchOp';
import { makeDeleteWords } from '../store/transcriptionWords/ops/deleteSelection';
import { makePasteWord } from '../store/transcriptionWords/ops/pasteWord';

const { dispatch } = store;

const pasteWord = (replaceRange: IndexRange, clipboard: Word[]) => {
  const { currentProject } = store.getState();

  if (currentProject && currentProject.transcription) {
    dispatchOp(makePasteWord(replaceRange, clipboard));
  }
};

export const copyText = () => {
  const words = store.getState().currentProject?.transcription?.words;
  const range = store.getState().selection.self;
  if (words === undefined) {
    return;
  }

  const clipboard = words.slice(range.startIndex, range.endIndex);
  dispatch(clipboardUpdated(clipboard));
};

export const deleteText: () => void = () => {
  const range = store.getState().selection.self;

  const { currentProject } = store.getState();

  if (!currentProject?.transcription) {
    return;
  }

  const words = currentProject.transcription.words.slice(
    range.startIndex,
    range.endIndex
  );

  const indices = excludeDeletedWords(range, words);

  if (indices.length === 0) {
    return;
  }

  dispatchOp(makeDeleteWords(indices));
};

export const cutText: () => void = () => {
  copyText();
  deleteText();
};

export const pasteText: () => void = () => {
  const range = store.getState().selection.self;
  const { clipboard } = store.getState();

  if (clipboard.length > 0) {
    pasteWord(range, clipboard);
  }

  // TODO(chloe): should also seek to the start of the pasted text.
};
