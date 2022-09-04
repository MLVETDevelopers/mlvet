import { Reducer } from 'redux';
import {
  UNDO_STACK_PUSHED,
  UNDO_STACK_POPPED,
  OP_REDONE,
  UndoStackSetPayload,
  UNDO_STACK_SET,
} from './actions';
import { ApplicationStore, initialStore } from '../sharedHelpers';
import { DoPayload, UndoPayload } from './opPayloads';
import { Action } from '../action';
import {
  CURRENT_PROJECT_CLOSED,
  PROJECT_OPENED,
} from '../currentProject/actions';
import { Op } from './helpers';

const undoStackReducer: Reducer<ApplicationStore['undoStack'], Action<any>> = (
  undoStack = initialStore.undoStack,
  action
) => {
  if (
    action.type === PROJECT_OPENED ||
    action.type === CURRENT_PROJECT_CLOSED
  ) {
    return initialStore.undoStack;
  }

  if (action.type === UNDO_STACK_SET) {
    const { ops, index } = action.payload as UndoStackSetPayload;

    return {
      stack: ops,
      index,
    };
  }

  if (action.type === UNDO_STACK_PUSHED) {
    const { stack, index } = undoStack;

    const newStack = stack
      .slice(0, index)
      .concat([action.payload as Op<DoPayload, UndoPayload>]);

    return {
      stack: newStack,
      index: newStack.length,
    };
  }

  if (action.type === UNDO_STACK_POPPED) {
    const { stack, index } = undoStack;

    return {
      stack,
      index: index - 1,
    };
  }

  if (action.type === OP_REDONE) {
    const { stack, index } = undoStack;

    return {
      stack,
      index: index + 1,
    };
  }

  return undoStack;
};

export default undoStackReducer;
