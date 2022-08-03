import { Word } from '../sharedTypes';
import { getSelectionRanges } from './selection';
import { clipboardUpdated } from './store/clipboard/actions';
import {
  selectionCleared,
  selectionRangeAdded,
} from './store/selection/actions';
import store from './store/store';
import { dispatchOp } from './store/undoStack/opHelpers';
import { makeDeleteWord, makePasteWord } from './store/undoStack/ops';

const { dispatch } = store;

const deleteWordRange = (firstWordIndex: number, lastWordIndex: number) => {
  const { currentProject } = store.getState();

  if (currentProject && currentProject.transcription) {
    dispatchOp(makeDeleteWord(firstWordIndex, lastWordIndex));
  }
};

const pasteWord = (afterWordIndex: number, clipboard: Word[]) => {
  const { currentProject } = store.getState();

  if (currentProject && currentProject.transcription) {
    dispatchOp(makePasteWord(afterWordIndex, clipboard));
  }
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

  const ranges = getSelectionRanges();
  const clipboard = ranges.flatMap((range) =>
    transcription.words.slice(range.startIndex, range.endIndex)
  );
  dispatch(clipboardUpdated(clipboard));
};

export const deleteText: () => void = () => {
  const ranges = getSelectionRanges();
  ranges.forEach((range) => deleteWordRange(range.startIndex, range.endIndex));

  dispatch(selectionCleared());
};

export const cutText: () => void = () => {
  copyText();
  deleteText();
};

export const pasteText: () => void = () => {
  const { clipboard } = store.getState();

  const ranges = getSelectionRanges();

  if (ranges.length === 0) {
    return;
  }

  // Paste after the last word in the selection
  const { endIndex } = ranges[ranges.length - 1];

  // End index is exclusive, so subtract one to get the actual word to paste after
  pasteWord(endIndex - 1, clipboard);

  // Select the pasted text
  dispatch(selectionCleared());
  dispatch(
    selectionRangeAdded({
      startIndex: endIndex,
      endIndex: endIndex + clipboard.length,
    })
  );

  // TODO(chloe): should also seek to the start of the pasted text
};
