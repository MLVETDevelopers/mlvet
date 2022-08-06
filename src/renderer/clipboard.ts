import { Word } from 'sharedTypes';
import { clipboardUpdated } from './store/clipboard/actions';
import store from './store/store';
import { dispatchOp } from './store/undoStack/opHelpers';
import { makeDeleteWord, makePasteWord } from './store/undoStack/ops';

const { dispatch } = store;

const deleteWord = (firstWordIndex: number, lastWordIndex: number) => {
  const { currentProject } = store.getState();

  if (currentProject && currentProject.transcription) {
    dispatchOp(makeDeleteWord(firstWordIndex, lastWordIndex));
  }
};

const pasteWord = (toWordIndex: number, clipboard: Word[]) => {
  const { currentProject } = store.getState();

  if (currentProject && currentProject.transcription) {
    dispatchOp(makePasteWord(toWordIndex, clipboard));
  }
};

// This function will return the index of the first word and the index of the last word
// selected on the transcription block. It will return values of null for each if no
// word is selected. It will return the same start and end value if only one value is
// selected.
//
// Currently a little janky and should be revised in a future iteration.
const getIndexSelectedWords = () => {
  const highlightedWords = window.getSelection();
  if (
    highlightedWords?.anchorNode?.parentElement?.dataset.type === 'word' &&
    highlightedWords?.focusNode?.parentElement?.dataset.type === 'word'
  ) {
    // TODO(chloe): the idea of counting the number of DOM elements to
    // find the index is really hacky,
    // we need to do better than this. No obvious ideas for now
    const anchor = Number(
      highlightedWords?.anchorNode?.parentElement?.dataset.index
    );
    const focus = Number(
      highlightedWords?.focusNode?.parentElement?.dataset.index
    );

    const start = Math.min(anchor, focus);
    const end = Math.max(anchor, focus) + 1; // exclusive end
    return [start, end];
  }
  return [null, null]; // Linter says I have to return a value here. Could return just null and check outside the function
};

export const copyText = () => {
  const { currentProject } = store.getState();
  if (currentProject === null) {
    return;
  }

  const { transcription } = currentProject;
  if (transcription === null) {
    return;
  }

  const [startIndex, endIndex] = getIndexSelectedWords();
  if (startIndex !== null && endIndex !== null) {
    dispatch(clipboardUpdated(transcription.words.slice(startIndex, endIndex)));
  }
};

export const deleteText = () => {
  const [startIndex, endIndex] = getIndexSelectedWords();
  if (startIndex !== null && endIndex !== null) {
    deleteWord(startIndex, endIndex);
  }
};

export const cutText = () => {
  copyText();
  deleteText();
};

export const pasteText = () => {
  const { clipboard } = store.getState();

  const [start, end] = getIndexSelectedWords();

  if (start !== null && end !== null) {
    pasteWord(start, clipboard);
  }
};
