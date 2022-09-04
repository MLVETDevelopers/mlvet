import { Action } from '../action';
import {
  Op,
  DoPayload,
  UndoPayload,
  UndoStackPoppedPayload,
  UndoStackPushedPayload,
} from './helpers';

// For declaring the state of the undo stack when joining a collab session
export const UNDO_STACK_SET = 'UNDO_STACK_SET';

export const UNDO_STACK_PUSHED = 'UNDO_STACK_PUSHED';
export const UNDO_STACK_POPPED = 'UNDO_STACK_POPPED';
export const OP_REDONE = 'OP_REDONE';

export type UndoStackSetPayload = {
  ops: Op<DoPayload, UndoPayload>[];
  index: number;
};

export const undoStackSet: (
  ops: Op<DoPayload, UndoPayload>[],
  index: number
) => Action<UndoStackSetPayload> = (ops, index) => ({
  type: UNDO_STACK_SET,
  payload: { ops, index },
});

export const undoStackPushed: (
  op: Op<DoPayload, UndoPayload>
) => Action<UndoStackPushedPayload> = (undoAction) => ({
  type: UNDO_STACK_PUSHED,
  payload: undoAction,
});

export const undoStackPopped: () => Action<UndoStackPoppedPayload> = () => ({
  type: UNDO_STACK_POPPED,
  payload: null,
});

export const opRedone: () => Action<null> = () => ({
  type: OP_REDONE,
  payload: null,
});
