import { Word } from '../../sharedTypes';
import { clipboardUpdated } from '../store/clipboard/actions';
import store from '../store/store';
import dispatchOp from '../store/dispatchOp';
import { makeDeleteSelection } from '../store/transcriptionWords/ops/deleteSelection';
import { makePasteWord } from '../store/transcriptionWords/ops/pasteWord';

const { dispatch } = store;

const pasteWord = (afterWordIndex: number, clipboard: Word[]) => {
  const { currentProject } = store.getState();
  const wordIndexRange = {
    startIndex: afterWordIndex,
    endIndex: afterWordIndex,
  }; // Need to convert number to index, to conform to param type.

  if (currentProject && currentProject.transcription) {
    dispatchOp(makePasteWord(wordIndexRange, clipboard));
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

  if (clipboard.length > 0) {
    pasteWord(range, clipboard);
  }

  // TODO(chloe): should also seek to the start of the pasted text.
};
