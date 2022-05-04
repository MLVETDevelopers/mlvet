import { Project } from '../../sharedTypes';
import { DoPayload, UndoPayload } from './opPayloads';

export enum ApplicationPage {
  HOME = 'HOME',
  PROJECT = 'PROJECT',
}

export type Action<T> = {
  type: string;
  payload: T;
};

/**
 * An Op is a representation of an action that can be both done and undone.
 * These are passed around the undo stack in the store to allow for undoing and redoing actions.
 */
export interface Op<T extends DoPayload, U extends UndoPayload> {
  do: Action<T>;
  undo: Action<U>;
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

/**
 * The schema for the root-level application / redux store, containing the global app state.
 */
export interface ApplicationStore {
  currentProject: Project | null;
  recentProjects: Project[];
  currentPage: ApplicationPage;
  undoStack: UndoStack;
}

/**
 * The initial state of the application store / redux store.
 * This is what the store looks like every time the application starts.
 */
export const initialStore: ApplicationStore = {
  currentProject: null,
  recentProjects: [],
  currentPage: ApplicationPage.HOME,
  undoStack: { stack: [], index: 0 },
};
