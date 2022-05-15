import ipc from '../ipc';
import { undoStackPopped, undoStackPushed, opRedone } from './actions';
import { Op } from './helpers';
import { DoPayload, UndoPayload } from './opPayloads';
import store from './store';

const { setUndoRedoEnabled } = ipc;
const { dispatch } = store;

/**
 * Send a message to the back end, informing it whether the undo/redo buttons
 * should be enabled in the edit menu based on the state of the undo stack
 */
const updateUndoRedoEnabledInMenu: () => void = () => {
  const { stack, index } = store.getState().undoStack;

  const undoEnabled = index > 0;
  const redoEnabled = index < stack.length;

  setUndoRedoEnabled(undoEnabled, redoEnabled);
};

/**
 * Dispatches an op, running its 'do' action and giving the undo stack a reference to the op.
 */
export const dispatchOp: <T extends DoPayload, U extends UndoPayload>(
  op: Op<T, U>
) => void = (op) => {
  // Dispatch the actual action
  dispatch(op.do);

  // Push the entire op to the undo stack, so that we can support undo and redo of this action
  dispatch(undoStackPushed(op));

  updateUndoRedoEnabledInMenu();
};

export const dispatchUndo: () => void = () => {
  const { stack, index } = store.getState().undoStack;

  // If we're at the beginning of the stack, there's nothing to undo
  if (index <= 0) {
    return;
  }

  // The index tells us how many undos are left before we've undone everything.
  // We want to undo the nth thing, so get stack[n-1]
  const lastAction = stack[index - 1];

  // Dispatch the undo
  dispatch(lastAction.undo);

  // Let the undo stack know we just did an undo so it can decrement its index
  dispatch(undoStackPopped());

  updateUndoRedoEnabledInMenu();
};

export const dispatchRedo: () => void = () => {
  const { stack, index } = store.getState().undoStack;

  // If we're at the end of the stack, there's nothing to redo
  if (index >= stack.length) {
    return;
  }

  // The index tells us how many undos are left before we've undone everything.
  // We want to redo the (n+1)th thing, so get stack[n]
  const lastAction = stack[index];

  // Dispatch the redo
  dispatch(lastAction.do);

  // Let the undo stack know we just did a redo so it can increment its index
  dispatch(opRedone());

  updateUndoRedoEnabledInMenu();
};
