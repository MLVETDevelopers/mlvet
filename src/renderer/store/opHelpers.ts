import { Dispatch } from 'redux';
import { undoStackPopped, undoStackPushed, opRedone } from './actions';
import { Op, UndoStack } from './helpers';
import { DoPayload, UndoPayload } from './opPayloads';

export const dispatchOp: <T extends DoPayload, U extends UndoPayload>(
  dispatch: Dispatch,
  op: Op<T, U>
) => void = (dispatch, op) => {
  dispatch(op.do);
  dispatch(undoStackPushed(op));
};

export const dispatchUndo: (
  dispatch: Dispatch,
  undoStack: UndoStack
) => void = (dispatch, undoStack) => {
  const { stack, index } = undoStack;

  if (index <= 0) {
    return;
  }

  const lastAction = stack[index - 1];
  dispatch(lastAction.undo);
  dispatch(undoStackPopped());
};

export const dispatchRedo: (
  dispatch: Dispatch,
  undoStack: UndoStack
) => void = (dispatch, undoStack) => {
  const { stack, index } = undoStack;

  if (index >= stack.length) {
    return;
  }

  const lastAction = stack[index];
  dispatch(lastAction.do);
  dispatch(opRedone());
};
