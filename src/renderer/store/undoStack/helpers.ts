import { Action } from '../action';
import {
  SelectionClearedPayload,
  SelectionRangeSetToPayload,
} from '../selection/actions';
import {
  DeleteTakeGroupPayload,
  SelectTakePayload,
  UndoDeleteTakeGroupPayload,
  UndoSelectTakePayload,
} from '../takeGroups/opPayloads';
import {
  CorrectWordPayload,
  DeleteSelectionPayload,
  MergeWordsPayload,
  PasteWordsPayload,
  SplitWordPayload,
  UndoCorrectWordPayload,
  UndoDeleteSelectionPayload,
  UndoMergeWordsPayload,
  UndoPasteWordsPayload,
  UndoSplitWordPayload,
} from '../transcriptionWords/opPayloads';

// Selection payloads can be applied to any op do or undo
export type SelectionPayload =
  | SelectionRangeSetToPayload
  | SelectionClearedPayload;

/**
 * An Op is a representation of an action that can be both done and undone.
 * These are passed around the undo stack in the store to allow for undoing and redoing actions.
 * The list of 'do' actions is represented in the order the actions are done.
 * The list of 'undo' actions is represented in the order the actions are undone.
 */
export interface Op<T extends OpPayload, U extends OpPayload> {
  do: Action<T | SelectionPayload>[];
  undo: Action<U | SelectionPayload>[];
  skipStack?: boolean; // bolt on for collab, so that we can represent undos themselves as ops (wow meta)
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

export type UndoStackPushedPayload = Op<DoPayload, UndoPayload>;
export type UndoStackPoppedPayload = null;

export type DoPayload =
  | DeleteSelectionPayload
  | PasteWordsPayload
  | CorrectWordPayload
  | MergeWordsPayload
  | SplitWordPayload
  | DeleteTakeGroupPayload
  | SelectTakePayload;

export type UndoPayload =
  | UndoDeleteSelectionPayload
  | UndoPasteWordsPayload
  | UndoCorrectWordPayload
  | UndoMergeWordsPayload
  | UndoSplitWordPayload
  | UndoDeleteTakeGroupPayload
  | UndoSelectTakePayload;

export type OpPayload =
  | DoPayload
  | UndoPayload
  | UndoStackPushedPayload
  | UndoStackPoppedPayload;
