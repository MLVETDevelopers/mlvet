import { Word } from '../../sharedTypes';
import { clipboardUpdated } from '../store/clipboard/actions';
import store from '../store/store';
import dispatchOp from '../store/dispatchOp';
import { makeDeleteSelection } from '../store/transcriptionWords/ops/deleteSelection';
import { makePasteWord } from '../store/transcriptionWords/ops/pasteWord';

const { dispatch } = store;

const pasteWord = (afterWordIndex: number, clipboard: Word[]) => {
  const { currentProject } = store.getState();

  if (currentProject && currentProject.transcription) {
    dispatchOp(makePasteWord(afterWordIndex, clipboard));
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

  if (currentProject && currentProject.transcription) {
    dispatchOp(makeDeleteSelection(range));
  }
};

export const cutText: () => void = () => {
  copyText();
  deleteText();
};

export const pasteText: () => void = () => {
  const range = store.getState().selection.self;
  const { clipboard } = store.getState();

  // Paste after the last word in the selection
  const { startIndex, endIndex } = range;

  if (clipboard.length && endIndex - startIndex > 1) {
    // only replace if you're highlighting more than one word.
    dispatchOp(makeDeleteSelection(range));
  }

  // End index is exclusive, so subtract one to get the actual word to paste after
  pasteWord(endIndex - 1, clipboard);

  // TODO(chloe): should also seek to the start of the pasted text.
};
