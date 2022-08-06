import { DoPayload, UndoPayload } from './opPayloads';
import { Action } from '../action';

/**
 * An Op is a representation of an action that can be both done and undone.
 * These are passed around the undo stack in the store to allow for undoing and redoing actions.
 * The list of 'do' actions is represented in the order the actions are done.
 * The list of 'undo' actions is represented as a matching list of operations
 * to undo each of the 'do' actions - that is, they are undone in reverse order.
 */
export interface Op<T extends DoPayload, U extends UndoPayload> {
  do: Action<T>[];
  undo: Action<U>[];
}

/**
 * The stack that stores Ops to track undo/redo state.
 * The stack itself is just a list of ops.
 * The index references the number of ops there are left to undo.
 * When the user undoes an action, the op is left in the stack so that they can later redo if
 * they want. We then decrement the index to point to the previous op.
 * Likewise, when the user redoes an action, we increment the index to point to the next op.
 */
export interface UndoStack {
  stack: Op<DoPayload, UndoPayload>[];
  index: number; // Used for supporting redo
}
