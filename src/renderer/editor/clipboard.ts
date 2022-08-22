import { WordComponent } from '../../sharedTypes';
import { getSelectionRanges } from './selection';
import { clipboardUpdated } from '../store/clipboard/actions';
import store from '../store/store';
import dispatchOp from '../store/dispatchOp';
import { makeDeleteSelection, makePasteWord } from '../store/undoStack/ops';

const { dispatch } = store;

const pasteWord = (afterWordIndex: number, clipboard: WordComponent[]) => {
  const { currentProject } = store.getState();

  if (currentProject && currentProject.transcription) {
    dispatchOp(makePasteWord(afterWordIndex, clipboard));
  }
};

export const copyText = () => {
  const words = store.getState().currentProject?.transcription?.words;
  if (words === undefined) {
    return;
  }

  const ranges = getSelectionRanges();
  const clipboard = ranges.flatMap((range) =>
    words.slice(range.startIndex, range.endIndex)
  );
  dispatch(clipboardUpdated(clipboard));
};

export const deleteText: () => void = () => {
  const ranges = getSelectionRanges();

  const { currentProject } = store.getState();

  if (currentProject && currentProject.transcription) {
    dispatchOp(makeDeleteSelection(ranges));
  }
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

  // TODO(chloe): should also seek to the start of the pasted text.
};
