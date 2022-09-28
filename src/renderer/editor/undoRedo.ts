import store from 'renderer/store/store';
import { opRedone, undoStackPopped } from 'renderer/store/undoStack/actions';

const { dispatch } = store;

export const performUndo: () => void = () => {
  const { stack, index } = store.getState().undoStack;

  // If we're at the beginning of the stack, there's nothing to undo
  if (index <= 0) {
    return;
  }

  // The index tells us how many undos are left before we've undone everything.
  // We want to undo the nth thing, so get stack[n-1]
  const lastAction = stack[index - 1];

  // Dispatch the undo operations
  lastAction.undo.forEach(dispatch);

  // Let the undo stack know we just did an undo so it can decrement its index
  dispatch(undoStackPopped());
};

export const performRedo: () => void = () => {
  const { stack, index } = store.getState().undoStack;

  // If we're at the end of the stack, there's nothing to redo
  if (index >= stack.length) {
    return;
  }

  // The index tells us how many undos are left before we've undone everything.
  // We want to redo the (n+1)th thing, so get stack[n]
  const lastAction = stack[index];

  // Dispatch the redo
  lastAction.do.forEach(dispatch);

  // Let the undo stack know we just did a redo so it can increment its index
  dispatch(opRedone());
};
