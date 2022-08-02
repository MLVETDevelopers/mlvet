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

const pasteWord = (
  toWordIndex: number,
  firstWordIndex: number,
  lastWordIndex: number
) => {
  const { currentProject } = store.getState();

  if (currentProject && currentProject.transcription) {
    dispatchOp(makePasteWord(toWordIndex, firstWordIndex, lastWordIndex));
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
    const anchor = Number(
      highlightedWords?.anchorNode?.parentElement?.dataset.index
    );
    const focus = Number(
      highlightedWords?.focusNode?.parentElement?.dataset.index
    );

    const start = Math.min(anchor, focus);
    const end = Math.max(anchor, focus);
    return [start, end];
  }
  return [null, null]; // Linter says I have to return a value here. Could return just null and check outside the function
};

export const copyText = () => {
  const [startIndex, endIndex] = getIndexSelectedWords();
  if (startIndex !== null && endIndex !== null) {
    dispatch(clipboardUpdated({ startIndex, endIndex }));
    console.log(`Updated clipboard. Start: ${startIndex} End: ${endIndex}`);
  }
};

export const deleteText = () => {
  const [startIndex, endIndex] = getIndexSelectedWords();
  if (startIndex !== null && endIndex !== null) {
    deleteWord(startIndex, endIndex);
  }
};

export const cutText = () => {
  // TODO(chloe): this two-step process kind of breaks the undo stack
  copyText();
  deleteText();
};

export const pasteText = () => {
  const { clipboard } = store.getState();

  const [start, end] = getIndexSelectedWords();
  if (start !== null && end !== null) {
    pasteWord(start, clipboard.startIndex, clipboard.endIndex);
    // Have to update the clipboard indices because they've moved if a word
    // is placed before them
    if (start < clipboard.startIndex) {
      const pasteLength = clipboard.endIndex - clipboard.startIndex + 1;
      dispatch(
        clipboardUpdated({
          startIndex: clipboard.startIndex + pasteLength,
          endIndex: clipboard.endIndex + pasteLength,
        })
      );
      console.log(
        `Updated clipboard. Start: ${clipboard.startIndex} End: ${clipboard.endIndex}`
      );
    }
  }
};
