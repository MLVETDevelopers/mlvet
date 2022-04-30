import { Reducer } from 'redux';
import {
  PROJECT_OPENED,
  CURRENT_PROJECT_CLOSED,
  UNDO_STACK_PUSHED,
  UNDO_STACK_POPPED,
  OP_REDONE,
} from '../actions';
import { Action, ApplicationStore, initialStore, Op } from '../helpers';
import { DoPayload, UndoPayload } from '../opPayloads';

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
