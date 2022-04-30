import { Dispatch } from 'redux';
import { undoStackPopped, undoStackPushed } from './actions';
import { Action, UndoStack } from './helpers';
import { DoPayload, UndoPayload } from './opPayloads';

export interface Op<T extends DoPayload, U extends UndoPayload> {
  do: Action<T>;
  undo: Action<U>;
}

export const dispatchOp: <T extends DoPayload, U extends UndoPayload>(
  dispatch: Dispatch,
  op: Op<T, U>
) => void = (dispatch, op) => {
  console.log('Dispatching op');
  dispatch(op.do);
  dispatch(undoStackPushed(op.undo));
};

export const dispatchUndo: (
  dispatch: Dispatch,
  undoStack: UndoStack
) => void = (dispatch, undoStack) => {
  if (undoStack.length === 0) {
    return;
  }

  const lastAction = undoStack[undoStack.length - 1];
  dispatch(lastAction);
  dispatch(undoStackPopped());
};
