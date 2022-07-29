import { Action } from '../action';
import { DoPayload, UndoPayload } from './opPayloads';
import { Op } from './helpers';

export const UNDO_STACK_PUSHED = 'UNDO_STACK_PUSHED';
export const UNDO_STACK_POPPED = 'UNDO_STACK_POPPED';
export const OP_REDONE = 'OP_REDONE';

export const undoStackPushed: <T extends DoPayload, U extends UndoPayload>(
  op: Op<T, U>
) => Action<Op<T, U>> = (undoAction) => ({
  type: UNDO_STACK_PUSHED,
  payload: undoAction,
});

export const undoStackPopped: () => Action<null> = () => ({
  type: UNDO_STACK_POPPED,
  payload: null,
});

export const opRedone: () => Action<null> = () => ({
  type: OP_REDONE,
  payload: null,
});
